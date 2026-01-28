import { createProjectSession } from "@homeplanet/framework";
import { assertAuthorityAllowedByAuthLevel, authoritiesForAuthLevel } from "@homeplanet/framework";
const projectStore = new Map();
function storeKey(sessionId, projectId) {
    return `${sessionId}::${projectId}`;
}
export async function openProject(ctx, input) {
    const session = await ctx.auth.getSession(input.sessionId);
    if (!session) {
        return {
            ok: false,
            error: { code: "E_NO_SESSION", message: "No active session (login required)" }
        };
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
    };
}
export async function commandTransitionFlow(ctx, input) {
    const opened = await openProject(ctx, input);
    if (!opened.ok)
        return opened;
    const { authLevel, project } = opened.value;
    try {
        // Auth-level gate
        assertAuthorityAllowedByAuthLevel(authLevel, input.authority);
        // Canonical rules (flow + protection)
        const next = project.transitionFlow(input.nextStep, input.authority);
        return { ok: true, value: next };
    }
    catch (e) {
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
export async function commandTransitionProjectState(ctx, input) {
    const opened = await openProject(ctx, input);
    if (!opened.ok)
        return opened;
    const { authLevel, project } = opened.value;
    try {
        // Auth-level gate
        assertAuthorityAllowedByAuthLevel(authLevel, input.authority);
        const next = project.transitionProjectState(input.nextState, input.authority);
        return { ok: true, value: next };
    }
    catch (e) {
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
//# sourceMappingURL=index.js.map