pipeline {
    agent { label 'kaniko-pod' }
    
    environment {
        REGISTRY = 'harbor.devflux.ru/demo'
        IMAGE_NAME = 'father-testing'
        IMAGE_TAG = "${BUILD_NUMBER}"
        DOCKERFILE = "Dockerfile"
        K8S_NAMESPACE = 'demo'
        DEPLOYMENT_NAME = 'father-testing'
        CONTAINER_NAME = 'app'
        K8S_MANIFEST = 'k8s/father-testing.yaml'
        HARBOR_URL = 'harbor.devflux.ru'
        FULL_IMAGE = "${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
    }
    
    stages {
        stage('Build & Push image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'harbor-user-pass', usernameVariable: 'HARBOR_USER', passwordVariable: 'HARBOR_PASS')]) {
                    container(name: 'kaniko') {
                        sh '''
                        set -ex
                        mkdir -p /kaniko/.docker
                        AUTH=$(echo -n "${HARBOR_USER}:${HARBOR_PASS}" | base64)
                        echo "{\\"auths\\": {\\"${HARBOR_URL}\\": {\\"auth\\": \\"${AUTH}\\"}}}" > /kaniko/.docker/config.json
                        /kaniko/executor \
                            --context "dir://$(pwd)" \
                            --dockerfile "${DOCKERFILE}" \
                            --destination "${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}" \
                            --destination "${REGISTRY}/${IMAGE_NAME}:latest" \
                            --cache=true
                        '''
                    }
                }
            }
        }
        
        stage('Deploy to K8s') {
            steps {
                container(name: 'kubectl') {
                    sh '''
                    set -ex
                    kubectl apply -f ${K8S_MANIFEST}
                    kubectl -n ${K8S_NAMESPACE} set image deployment/${DEPLOYMENT_NAME} ${CONTAINER_NAME}=${FULL_IMAGE}
                    kubectl -n ${K8S_NAMESPACE} rollout status deployment/${DEPLOYMENT_NAME} --timeout=180s
                    '''
                }
            }
        }

        stage('Notify Telegram') {
            steps {
                container(name: 'kubectl') {
                    sh '''
                    set -ex
                    # Call jenkins-notify-api to send Telegram notification
                    CLUSTER_IP=$(kubectl get svc jenkins-notify-service -n devops-tools -o jsonpath='{.spec.clusterIP}' 2>/dev/null) || true
                    if [ -n "$CLUSTER_IP" ]; then
                        NOTIFICATION_JSON=$(cat <<EOF
                        {
                            "job_name": "${JOB_NAME}",
                            "build_number": ${BUILD_NUMBER},
                            "status": "SUCCESS",
                            "url": "${BUILD_URL}",
                            "message": "Успешный деплой father-testing",
                            "author": "Jenkins",
                            "branch": "${BRANCH_NAME}"
                        }
                        EOF
                        )
                        curl -s -X POST "http://$CLUSTER_IP/jenkins/notify" \
                            -H "Content-Type: application/json" \
                            -H "X-API-Key: 23Asa9DjE1aeGAPdSpGPJQxelQzutS5Hr6554kIiTAweV8KILP9yf82LNUhZ5F06" \
                            -d "$NOTIFICATION_JSON"
                    fi
                    '''
                }
            }
        }
    }
}
