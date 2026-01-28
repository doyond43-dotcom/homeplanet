import type { FlowStep, ProjectId, ProjectState } from "@homeplanet/core";
import type { AuthPort, SessionId } from "@homeplanet/auth";
export type CommandResult<T> = {
    ok: true;
    value: T;
} | {
    ok: false;
    error: {
        code: string;
        message: string;
        details?: Record<string, unknown>;
    };
};
export type CommandContext = {
    auth: AuthPort;
};
export type ProjectHandle = {
    projectId: ProjectId;
    sessionId: SessionId;
};
export declare function openProject(ctx: CommandContext, input: ProjectHandle): Promise<{
    readonly ok: false;
    readonly error: {
        readonly code: "E_NO_SESSION";
        readonly message: "No active session (login required)";
    };
    readonly value?: undefined;
} | {
    readonly ok: true;
    readonly value: {
        readonly authLevel: import("@homeplanet/auth").AuthLevel;
        readonly allowedAuthorities: import("@homeplanet/core").Authority[];
        readonly project: {
            transitionFlow: (nextStep: FlowStep, authority: import("@homeplanet/core").Authority) => import("@homeplanet/framework").ProjectSessionStatus;
            transitionProjectState: (nextState: ProjectState, authority: import("@homeplanet/core").Authority) => import("@homeplanet/framework").ProjectSessionStatus;
            setProtectionGate: (authority: import("@homeplanet/core").Authority) => import("@homeplanet/framework").ProjectSessionStatus;
            getStatus: () => import("@homeplanet/framework").ProjectSessionStatus;
        };
    };
    readonly error?: undefined;
}>;
export declare function commandTransitionFlow(ctx: CommandContext, input: ProjectHandle & {
    nextStep: FlowStep;
    authority: string;
}): Promise<CommandResult<unknown>>;
export declare function commandTransitionProjectState(ctx: CommandContext, input: ProjectHandle & {
    nextState: ProjectState;
    authority: string;
}): Promise<CommandResult<unknown>>;
//# sourceMappingURL=index.d.ts.map