import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { HomePage } from "../pages/HomePage";
import { ProfileProvider } from "./ProfileContext";

describe("profile storage", () => {
  it("saves test size setting to localStorage", () => {
    localStorage.clear();
    render(
      <MemoryRouter>
        <ProfileProvider>
          <HomePage />
        </ProfileProvider>
      </MemoryRouter>
    );

    const slider = screen.getByLabelText(/Размер контрольной сессии/i);
    fireEvent.change(slider, { target: { value: "33" } });

    const raw = localStorage.getItem("father_testing_profile_v1");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.settings.sessionSizeDefault).toBe(33);
  });
});

