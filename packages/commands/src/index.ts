import type { FlowStep, ProjectId, ProjectState } from "@homeplanet/core";
import type { AuthPort, SessionId } from "@homeplanet/auth";
import { createProjectSession } from "@homeplanet/framework";
import { assertAuthorityAllowedByAuthLevel, authoritiesForAuthLevel } from "@homeplanet/framework";

export type CommandResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: { code: string; message: string; details?: Record<string, unknown> } };

export type CommandContext = {
  auth: AuthPort;
};

export type ProjectHandle = {
  projectId: ProjectId;
  sessionId: SessionId;
};

/**
 * In-memory project store (v0)
 * Key = sessionId + projectId
 * This makes commands stateful without any DB yet.
 */
type StoredProject = ReturnType<typeof createProjectSession>;

const projectStore = new Map<string, StoredProject>();

function storeKey(sessionId: SessionId, projectId: ProjectId) {
  return `${sessionId}::${projectId}`;
}

export async function openProject(ctx: CommandContext, input: ProjectHandle) {
  const session = await ctx.auth.getSession(input.sessionId);
  if (!session) {
    return {
      ok: false,
      error: { code: "E_NO_SESSION", message: "No active session (login required)" }
    } as const;
  }

  const key = storeKey(input.sessionId, input.projectId);

  let ps = projectStore.get(key);
  if (!ps) {
    ps = createProjectSession(session.humanId || "human:unknown", input.projectId);
    projectStore.set(key, ps);
  }

  return {
    ok: true,
    value: {
      authLevel: session.level,
      allowedAuthorities: authoritiesForAuthLevel(session.level),
      project: ps
    }
  } as const;
}

export async function commandTransitionFlow(
  ctx: CommandContext,
  input: ProjectHandle & { nextStep: FlowStep; authority: string }
): Promise<CommandResult<unknown>> {
  const opened = await openProject(ctx, input);
  if (!opened.ok) return opened;

  const { authLevel, project } = opened.value;

  try {
    // Auth-level gate
    assertAuthorityAllowedByAuthLevel(authLevel, input.authority as any);

    // Canonical rules (flow + protection)
    const next = project.transitionFlow(input.nextStep, input.authority as any);
    return { ok: true, value: next };
  } catch (e: any) {
    return {
      ok: false,
      error: {
        code: e?.code || "E_COMMAND_FAILED",
        message: e?.message || "Command failed",
        details: e?.details
      }
    };
  }
}

export async function commandTransitionProjectState(
  ctx: CommandContext,
  input: ProjectHandle & { nextState: ProjectState; authority: string }
): Promise<CommandResult<unknown>> {
  const opened = await openProject(ctx, input);
  if (!opened.ok) return opened;

  const { authLevel, project } = opened.value;

  try {
    // Auth-level gate
    assertAuthorityAllowedByAuthLevel(authLevel, input.authority as any);

    const next = project.transitionProjectState(input.nextState, input.authority as any);
    return { ok: true, value: next };
  } catch (e: any) {
    return {
      ok: false,
      error: {
        code: e?.code || "E_COMMAND_FAILED",
        message: e?.message || "Command failed",
        details: e?.details
      }
    };
  }
}
