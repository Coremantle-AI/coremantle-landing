// PostHog product analytics, ported from the static site's
// site-navigation.js. Autocapture records pageviews, clicks and form submits
// with no per-page code; with `defaults: '2026-05-30'` PostHog also captures
// a pageview on every client-side route change (history_change).
//
// Configured per environment (see .env.example):
//   NEXT_PUBLIC_POSTHOG_KEY   project key (phc_...), public by design
//   NEXT_PUBLIC_POSTHOG_HOST  https://us.i.posthog.com (EU: https://eu.i.posthog.com)
// NEXT_PUBLIC_* values are inlined at build time, so a change needs a rebuild.
// If a CSP is added later, allow https://*.posthog.com.

export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? '';
export const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

// Not configured (or a placeholder) -> analytics stays off, so no broken
// requests fire.
export const posthogEnabled = POSTHOG_KEY.startsWith('phc_');

// The official loader snippet: stubs window.posthog, then pulls array.js from
// the PostHog asset host and replays queued calls.
export const posthogSnippet = `!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug getPageViewId captureTraceFeedback captureTraceMetric".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init(${JSON.stringify(POSTHOG_KEY)}, { api_host: ${JSON.stringify(POSTHOG_HOST)}, defaults: '2026-05-30' });`;
