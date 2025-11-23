(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/hooks/useLocalStorage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useLocalStorage(key, initialValue) {
    _s();
    const [storedValue, setStoredValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "useLocalStorage.useState": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            try {
                const item = window.localStorage.getItem(key);
                return item ? JSON.parse(item) : initialValue;
            } catch (error) {
                console.log(error);
                return initialValue;
            }
        }
    }["useLocalStorage.useState"]);
    const setValue = (value)=>{
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if ("TURBOPACK compile-time truthy", 1) {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.log(error);
        }
    };
    return [
        storedValue,
        setValue
    ];
}
_s(useLocalStorage, "mwi5SraK00l+xkw17QlqwY+kD2k=");
const __TURBOPACK__default__export__ = useLocalStorage;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/constants.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_HABITS",
    ()=>DEFAULT_HABITS,
    "DEFAULT_SCORING_RULES",
    ()=>DEFAULT_SCORING_RULES,
    "TRACKERS",
    ()=>TRACKERS
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/v4.js [app-client] (ecmascript) <export default as v4>");
;
;
const LayoutGridIcon = (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "3",
                y: "3",
                width: "7",
                height: "7"
            }, void 0, false, {
                fileName: "[project]/src/constants.tsx",
                lineNumber: 6,
                columnNumber: 191
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "14",
                y: "3",
                width: "7",
                height: "7"
            }, void 0, false, {
                fileName: "[project]/src/constants.tsx",
                lineNumber: 6,
                columnNumber: 231
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "14",
                y: "14",
                width: "7",
                height: "7"
            }, void 0, false, {
                fileName: "[project]/src/constants.tsx",
                lineNumber: 6,
                columnNumber: 272
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "3",
                y: "14",
                width: "7",
                height: "7"
            }, void 0, false, {
                fileName: "[project]/src/constants.tsx",
                lineNumber: 6,
                columnNumber: 314
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/constants.tsx",
        lineNumber: 6,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c = LayoutGridIcon;
const TrendingUpIcon = (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "23 6 13.5 15.5 8.5 10.5 1 18"
            }, void 0, false, {
                fileName: "[project]/src/constants.tsx",
                lineNumber: 9,
                columnNumber: 191
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "17 6 23 6 23 12"
            }, void 0, false, {
                fileName: "[project]/src/constants.tsx",
                lineNumber: 9,
                columnNumber: 240
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/constants.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c1 = TrendingUpIcon;
const BookOpenIcon = (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
            }, void 0, false, {
                fileName: "[project]/src/constants.tsx",
                lineNumber: 12,
                columnNumber: 191
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
            }, void 0, false, {
                fileName: "[project]/src/constants.tsx",
                lineNumber: 12,
                columnNumber: 243
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/constants.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c2 = BookOpenIcon;
const WalletIcon = (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M21 12V7H5a2 2 0 0 1 0-4h14v4"
            }, void 0, false, {
                fileName: "[project]/src/constants.tsx",
                lineNumber: 15,
                columnNumber: 191
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3 5v14a2 2 0 0 0 2 2h16v-5"
            }, void 0, false, {
                fileName: "[project]/src/constants.tsx",
                lineNumber: 15,
                columnNumber: 232
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M18 12a2 2 0 0 0 0 4h4v-4Z"
            }, void 0, false, {
                fileName: "[project]/src/constants.tsx",
                lineNumber: 15,
                columnNumber: 271
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/constants.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c3 = WalletIcon;
const GoalIcon = (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 13V2l8 4-8 4"
            }, void 0, false, {
                fileName: "[project]/src/constants.tsx",
                lineNumber: 18,
                columnNumber: 191
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 22v-8h8"
            }, void 0, false, {
                fileName: "[project]/src/constants.tsx",
                lineNumber: 18,
                columnNumber: 219
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 12v8h8"
            }, void 0, false, {
                fileName: "[project]/src/constants.tsx",
                lineNumber: 18,
                columnNumber: 242
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/constants.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c4 = GoalIcon;
const QuoteIcon = (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 2v6c0 7 4 8 8 8Z"
            }, void 0, false, {
                fileName: "[project]/src/constants.tsx",
                lineNumber: 21,
                columnNumber: 191
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2h-4c-1.25 0-2 .75-2 2v6c0 7 4 8 8 8Z"
            }, void 0, false, {
                fileName: "[project]/src/constants.tsx",
                lineNumber: 21,
                columnNumber: 279
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/constants.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c5 = QuoteIcon;
// FIX: Add a new icon for the Achievements tracker.
const TrophyIcon = (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M12 2L9 5H3v6l4 4-1 5 4-2 4 2-1-5 4-4V5h-6z"
        }, void 0, false, {
            fileName: "[project]/src/constants.tsx",
            lineNumber: 25,
            columnNumber: 191
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/constants.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c6 = TrophyIcon;
const TRACKERS = [
    {
        id: 'planner',
        name: 'Planner',
        icon: LayoutGridIcon
    },
    {
        id: 'points',
        name: 'Points',
        icon: TrendingUpIcon
    },
    {
        id: 'journal',
        name: 'Journal',
        icon: BookOpenIcon
    },
    {
        id: 'expense',
        name: 'Expenses',
        icon: WalletIcon
    },
    {
        id: 'goals',
        name: 'Goals',
        icon: GoalIcon
    },
    {
        id: 'quotes',
        name: 'Quotes',
        icon: QuoteIcon
    },
    {
        id: 'achievements',
        name: 'Achievements',
        icon: TrophyIcon
    }
];
const DEFAULT_HABITS = [
    {
        id: 'wake_up',
        name: 'Wake up Early',
        target: 250,
        rangeMax: 10
    },
    {
        id: 'exercise',
        name: 'Exercise',
        target: 200,
        rangeMax: 10
    },
    {
        id: 'dsa',
        name: 'DSA Practice',
        target: 250,
        rangeMax: 10
    },
    {
        id: 'dev',
        name: 'Development',
        target: 300,
        rangeMax: 10
    },
    {
        id: 'pro_time',
        name: 'Pro-Time',
        target: 280,
        rangeMax: 10
    },
    {
        id: 'learning',
        name: 'Learning',
        target: 200,
        rangeMax: 10
    },
    {
        id: 'reading',
        name: 'Book Reading',
        target: 200,
        rangeMax: 10
    },
    {
        id: 'games',
        name: 'Games',
        target: 300,
        rangeMax: 10
    },
    {
        id: 'social',
        name: 'Social Media',
        target: 300,
        rangeMax: 10
    }
];
const DEFAULT_SCORING_RULES = [
    {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
        activity: 'Wake up Early',
        maxPoints: 10,
        penaltyRule: '-1 per 30 mins after target wake time',
        zeroPointsCondition: 'Oversleep (12 hrs)',
        scoringLogic: 'Need ≥8 hrs sleep; points drop if waking too late'
    },
    {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
        activity: 'Exercise',
        maxPoints: 10,
        penaltyRule: 'No workout = 0',
        zeroPointsCondition: 'No exercise done',
        scoringLogic: '8 pts for workout intensity; +2 pts for stretching/mobility (keeps streak alive)'
    },
    {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
        activity: 'DSA Practice',
        maxPoints: 10,
        penaltyRule: 'No practice = 0',
        zeroPointsCondition: 'No DSA done',
        scoringLogic: 'Points based on number of questions solved'
    },
    {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
        activity: 'Development (Coding)',
        maxPoints: 10,
        penaltyRule: 'No coding = 0',
        zeroPointsCondition: 'No coding done',
        scoringLogic: '≥6 hrs → 10 points; major project in a day → 10; micro-commit/refactor → 5 points'
    },
    {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
        activity: 'Pro-Time (Research/Work)',
        maxPoints: 10,
        penaltyRule: '-1 for idle/wasted time',
        zeroPointsCondition: 'Entire time wasted',
        scoringLogic: 'Score depends on hours spent in research/career tasks'
    },
    {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
        activity: 'Learning (New Skills)',
        maxPoints: 10,
        penaltyRule: '-1 if skipped',
        zeroPointsCondition: 'No study done',
        scoringLogic: 'Input (study/course) → 5 pts; Output (notes/blog/demo) → +5 pts; ≥2 hrs total = 10'
    },
    {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
        activity: 'Book Reading',
        maxPoints: 10,
        penaltyRule: '-2 points per page less than 5',
        zeroPointsCondition: 'No reading done',
        scoringLogic: '5 pages = 8 pts; >5 pages → 10 points'
    },
    {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
        activity: 'Games',
        maxPoints: 10,
        penaltyRule: '-2 points per 10 mins played',
        zeroPointsCondition: 'Heavy gaming session',
        scoringLogic: 'No gaming → 10 points; 1 hr → 8, etc.'
    },
    {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
        activity: 'Social Media',
        maxPoints: 10,
        penaltyRule: '-2 points per 10 mins beyond 1 hr',
        zeroPointsCondition: 'Excessive scrolling',
        scoringLogic: '<1 hr → 10 points; >1 hr → lose points'
    }
];
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "LayoutGridIcon");
__turbopack_context__.k.register(_c1, "TrendingUpIcon");
__turbopack_context__.k.register(_c2, "BookOpenIcon");
__turbopack_context__.k.register(_c3, "WalletIcon");
__turbopack_context__.k.register(_c4, "GoalIcon");
__turbopack_context__.k.register(_c5, "QuoteIcon");
__turbopack_context__.k.register(_c6, "TrophyIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/dummy_data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// FIX: Corrected import paths for types and constants.
__turbopack_context__.s([
    "DUMMY_DATA",
    ()=>DUMMY_DATA
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants.tsx [app-client] (ecmascript)");
;
const generatePastData = ()=>{
    const data = {};
    const today = new Date();
    for(let i = 90; i > 0; i--){
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        const habits = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_HABITS"].map((h)=>({
                ...h,
                completed: Math.random() > 0.4
            }));
        const habitScores = {};
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_HABITS"].forEach((habit)=>{
            habitScores[habit.id] = Math.floor(Math.random() * 11);
        });
        const totalPoints = Math.round(Object.values(habitScores).reduce((sum, score)=>sum + score, 0) / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_HABITS"].length);
        data[dateString] = {
            habits,
            points: totalPoints,
            journal: i % 5 === 0 ? `This is a journal entry for ${dateString}. Feeling pretty good about my progress.` : '',
            habitScores
        };
    }
    return data;
};
const DUMMY_DATA = generatePastData();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/quotes_data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DUMMY_QUOTES",
    ()=>DUMMY_QUOTES
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/v4.js [app-client] (ecmascript) <export default as v4>");
;
const DUMMY_QUOTES = [
    {
        id: 'bleach',
        title: 'Bleach',
        type: 'Web Series',
        coverImage: 'https://placehold.co/400x600/0a0a0a/7c3aed/png?text=Bleach',
        quotes: [
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
                text: "If miracles only happen once, what are they called the second time?",
                author: "Ichigo Kurosaki",
                tags: [
                    "philosophy",
                    "determination"
                ]
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
                text: "Fear is not evil. It tells you what your weakness is. And once you know your weakness, you can become stronger as well as kinder.",
                author: "Gildarts Clive",
                tags: [
                    "fear",
                    "strength"
                ]
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
                text: "Arrogance destroys the footholds of victory.",
                author: "Byakuya Kuchiki",
                tags: [
                    "wisdom",
                    "warning"
                ]
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
                text: "We are all like fireworks: we climb, we shine and always go our separate ways and become further apart. But even when that time comes, let's not disappear like a firework and continue to shine... forever.",
                author: "Toshiro Hitsugaya",
                tags: [
                    "friendship",
                    "philosophy"
                ]
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
                text: "There is no such thing as 'truth' or 'lies' in this world; there never has been. There is only plain, hard facts. And yet, all beings who exist in this world take only those 'facts' that are convenient to them, and take them to be the 'truth'.",
                author: "Sosuke Aizen",
                tags: [
                    "philosophy",
                    "truth"
                ]
            }
        ]
    },
    {
        id: 'the-office',
        title: 'The Office',
        type: 'Web Series',
        coverImage: 'https://placehold.co/400x600/0a0a0a/7c3aed/png?text=The+Office',
        quotes: [
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
                text: "Would I rather be feared or loved? Easy. Both. I want people to be afraid of how much they love me.",
                author: "Michael Scott",
                tags: [
                    "funny",
                    "love"
                ]
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
                text: "I'm not superstitious, but I am a little stitious.",
                author: "Michael Scott",
                tags: [
                    "funny",
                    "superstition"
                ]
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
                text: "Bears. Beets. Battlestar Galactica.",
                author: "Jim Halpert",
                tags: [
                    "funny",
                    "impersonation"
                ]
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
                text: "Identity theft is not a joke, Jim! Millions of families suffer every year!",
                author: "Dwight Schrute",
                tags: [
                    "funny",
                    "warning"
                ]
            }
        ]
    },
    {
        id: 'breaking-bad',
        title: 'Breaking Bad',
        type: 'Web Series',
        coverImage: 'https://placehold.co/400x600/0a0a0a/7c3aed/png?text=Breaking+Bad',
        quotes: [
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
                text: "I am not in danger, Skyler. I am the danger.",
                author: "Walter White",
                tags: [
                    "power",
                    "iconic",
                    "danger"
                ]
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
                text: "Say my name.",
                author: "Walter White",
                tags: [
                    "power",
                    "iconic"
                ]
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
                text: "Yeah, bitch! Magnets!",
                author: "Jesse Pinkman",
                tags: [
                    "funny",
                    "science"
                ]
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
                text: "No more half measures.",
                author: "Mike Ehrmantraut",
                tags: [
                    "wisdom",
                    "determination",
                    "warning"
                ]
            }
        ]
    },
    {
        id: 'interstellar',
        title: 'Interstellar',
        type: 'Movie',
        coverImage: 'https://placehold.co/400x600/0a0a0a/7c3aed/png?text=Interstellar',
        quotes: [
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
                text: "Do not go gentle into that good night; Old age should burn and rave at close of day. Rage, rage against the dying of the light.",
                author: "Professor Brand",
                tags: [
                    "poetry",
                    "determination",
                    "hope"
                ]
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
                text: "We used to look up at the sky and wonder at our place in the stars. Now we just look down and worry about our place in the dirt.",
                author: "Cooper",
                tags: [
                    "humanity",
                    "philosophy"
                ]
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
                text: "Love is the one thing we're capable of perceiving that transcends dimensions of time and space.",
                author: "Amelia Brand",
                tags: [
                    "love",
                    "philosophy",
                    "science"
                ]
            }
        ]
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/achievements_data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DUMMY_ACHIEVEMENTS",
    ()=>DUMMY_ACHIEVEMENTS
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/v4.js [app-client] (ecmascript) <export default as v4>");
;
const DUMMY_ACHIEVEMENTS = [
    {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
        title: "Launched First Project",
        description: "Successfully deployed the 'Daily Tracker' application, marking a significant milestone in personal development projects. The launch involved setting up the CI/CD pipeline and ensuring a stable production environment.",
        date: "2023-10-26",
        tags: [
            "professional",
            "coding",
            "milestone"
        ],
        coverImage: "https://placehold.co/600x400/7c3aed/ffffff/png?text=Project+Launch",
        images: [
            "https://placehold.co/800x600/1a1a1a/f5f5f5/png?text=Code+Snapshot",
            "https://placehold.co/800x600/262626/a3a3a3/png?text=Deployment+Logs",
            "https://placehold.co/800x600/2e2e2e/f5f5f5/png?text=Live+App+Screenshot"
        ]
    },
    {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
        title: "Completed a Marathon",
        description: "Ran the annual city marathon, finishing with a personal best time. This was the culmination of 6 months of intense training and dedication.",
        date: "2023-08-15",
        tags: [
            "personal",
            "health",
            "fitness",
            "milestone"
        ],
        coverImage: "https://placehold.co/600x400/10b981/ffffff/png?text=Marathon+Finish",
        images: [
            "https://placehold.co/800x600/1a1a1a/f5f5f5/png?text=Finish+Line",
            "https://placehold.co/800x600/262626/a3a3a3/png?text=Medal",
            "https://placehold.co/800x600/2e2e2e/f5f5f5/png?text=Training+Route"
        ]
    },
    {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
        title: "Mountain Summit",
        description: "Reached the summit of Mount Beacon after a challenging 5-hour hike. The views from the top were breathtaking and made the effort worthwhile.",
        date: "2023-06-02",
        tags: [
            "personal",
            "travel",
            "adventure"
        ],
        coverImage: "https://placehold.co/600x400/f59e0b/ffffff/png?text=Mountain+Summit",
        images: [
            "https://placehold.co/800x600/1a1a1a/f5f5f5/png?text=Summit+View",
            "https://placehold.co/800x600/262626/a3a3a3/png?text=Hiking+Trail"
        ]
    },
    {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
        title: "Learned 3D Modeling",
        description: "Completed an online course on Blender, learning the fundamentals of 3D modeling, texturing, and rendering. Created a small animated short as a final project.",
        date: "2023-03-20",
        tags: [
            "learning",
            "creative",
            "coding"
        ],
        coverImage: "https://placehold.co/600x400/3b82f6/ffffff/png?text=3D+Donut",
        images: [
            "https://placehold.co/800x600/1a1a1a/f5f5f5/png?text=Blender+Screenshot",
            "https://placehold.co/800x600/262626/a3a3a3/png?text=Final+Render"
        ]
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/src/components/Sidebar.tsx'\n\nExpression expected");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
"[project]/src/context/DataContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DataContext",
    ()=>DataContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
const DataContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/context/SettingsContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SettingsContext",
    ()=>SettingsContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
const SettingsContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/SettingsModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// FIX: Corrected import paths for context and types.
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/DataContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/SettingsContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const SettingsModal = ()=>{
    _s();
    const { settings, setSettings, setIsSettingsModalOpen, t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsContext"]);
    const { logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataContext"]);
    const handleThemeChange = (theme)=>{
        setSettings((s)=>({
                ...s,
                theme
            }));
    };
    const handleTimeFormatChange = (format)=>{
        setSettings((s)=>({
                ...s,
                timeFormat: format
            }));
    };
    const handleLanguageChange = (lang)=>{
        setSettings((s)=>({
                ...s,
                language: lang
            }));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in",
        onClick: ()=>setIsSettingsModalOpen(false),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-card-bg p-8 rounded-xl shadow-2xl w-full max-w-md",
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-2xl font-bold mb-6 text-text-primary",
                    children: t('settings')
                }, void 0, false, {
                    fileName: "[project]/src/components/SettingsModal.tsx",
                    lineNumber: 32,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-text-secondary mb-2",
                            children: t('Theme')
                        }, void 0, false, {
                            fileName: "[project]/src/components/SettingsModal.tsx",
                            lineNumber: 36,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex space-x-2",
                            children: [
                                'light',
                                'dark'
                            ].map((theme)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleThemeChange(theme),
                                    className: `w-full py-2 rounded-md text-sm capitalize transition-colors ${settings.theme === theme ? 'bg-accent-primary text-white' : 'bg-input-bg hover:bg-border'}`,
                                    children: t(theme)
                                }, theme, false, {
                                    fileName: "[project]/src/components/SettingsModal.tsx",
                                    lineNumber: 39,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/src/components/SettingsModal.tsx",
                            lineNumber: 37,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/SettingsModal.tsx",
                    lineNumber: 35,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-text-secondary mb-2",
                            children: t('Time Format')
                        }, void 0, false, {
                            fileName: "[project]/src/components/SettingsModal.tsx",
                            lineNumber: 52,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex space-x-2",
                            children: [
                                '12h',
                                '24h'
                            ].map((format)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleTimeFormatChange(format),
                                    className: `w-full py-2 rounded-md text-sm ${settings.timeFormat === format ? 'bg-accent-primary text-white' : 'bg-input-bg hover:bg-border'}`,
                                    children: format === '12h' ? t('12-Hour') : t('24-Hour')
                                }, format, false, {
                                    fileName: "[project]/src/components/SettingsModal.tsx",
                                    lineNumber: 55,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/src/components/SettingsModal.tsx",
                            lineNumber: 53,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/SettingsModal.tsx",
                    lineNumber: 51,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-text-secondary mb-2",
                            children: t('Language (UI Only)')
                        }, void 0, false, {
                            fileName: "[project]/src/components/SettingsModal.tsx",
                            lineNumber: 68,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: settings.language,
                            onChange: (e)=>handleLanguageChange(e.target.value),
                            className: "w-full p-2 rounded-md bg-input-bg border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "en",
                                    children: t('English')
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SettingsModal.tsx",
                                    lineNumber: 74,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "es",
                                    children: t('Español')
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SettingsModal.tsx",
                                    lineNumber: 75,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "fr",
                                    children: t('Français')
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SettingsModal.tsx",
                                    lineNumber: 76,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SettingsModal.tsx",
                            lineNumber: 69,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/SettingsModal.tsx",
                    lineNumber: 67,
                    columnNumber: 18
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setIsSettingsModalOpen(false),
                    className: "w-full py-2 rounded-md font-semibold text-white bg-accent-primary hover:bg-accent-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary mb-4",
                    children: t('Close')
                }, void 0, false, {
                    fileName: "[project]/src/components/SettingsModal.tsx",
                    lineNumber: 80,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "pt-4 border-t border-border",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            setIsSettingsModalOpen(false);
                            logout();
                        },
                        className: "w-full py-2 rounded-md font-semibold text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-colors focus:outline-none",
                        children: "Log Out"
                    }, void 0, false, {
                        fileName: "[project]/src/components/SettingsModal.tsx",
                        lineNumber: 88,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/SettingsModal.tsx",
                    lineNumber: 87,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/SettingsModal.tsx",
            lineNumber: 28,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/SettingsModal.tsx",
        lineNumber: 24,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(SettingsModal, "j0Jnf2U2tBNaSb2TqNV8TXTMDsw=");
_c = SettingsModal;
const __TURBOPACK__default__export__ = SettingsModal;
var _c;
__turbopack_context__.k.register(_c, "SettingsModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/Button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const Button = ({ children, className, ...props })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: `px-5 py-2.5 rounded-lg font-semibold text-white bg-accent-primary hover:bg-accent-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary focus:ring-offset-background disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg ${className}`,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/Button.tsx",
        lineNumber: 5,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_c = Button;
const __TURBOPACK__default__export__ = Button;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/EditHabitsModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/v4.js [app-client] (ecmascript) <export default as v4>");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const EditHabitsModal = ({ habits, setHabits, onClose })=>{
    _s();
    const [localHabits, setLocalHabits] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(JSON.parse(JSON.stringify(habits)));
    const handleHabitChange = (id, field, value)=>{
        setLocalHabits((prev)=>prev.map((h)=>h.id === id ? {
                    ...h,
                    [field]: value
                } : h));
    };
    const handleAddHabit = ()=>{
        setLocalHabits((prev)=>[
                ...prev,
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
                    name: 'New Habit',
                    target: 100,
                    rangeMax: 10
                }
            ]);
    };
    const handleDeleteHabit = (id)=>{
        setLocalHabits((prev)=>prev.filter((h)=>h.id !== id));
    };
    const handleSave = ()=>{
        setHabits(localHabits);
        onClose();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in",
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-card-bg p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col",
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-2xl font-bold mb-6 text-text-primary",
                    children: "Manage Habits"
                }, void 0, false, {
                    fileName: "[project]/src/components/EditHabitsModal.tsx",
                    lineNumber: 41,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "overflow-y-auto pr-4 -mr-4 space-y-4",
                    children: localHabits.map((habit)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-12 gap-4 items-center p-3 bg-input-bg rounded-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-xs text-text-secondary",
                                            children: "Name"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/EditHabitsModal.tsx",
                                            lineNumber: 47,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: habit.name,
                                            onChange: (e)=>handleHabitChange(habit.id, 'name', e.target.value),
                                            className: "w-full mt-1 p-2 rounded-md bg-background border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/EditHabitsModal.tsx",
                                            lineNumber: 48,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/EditHabitsModal.tsx",
                                    lineNumber: 46,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-xs text-text-secondary",
                                            children: "Daily Range Max"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/EditHabitsModal.tsx",
                                            lineNumber: 56,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            value: habit.rangeMax ?? 10,
                                            onChange: (e)=>handleHabitChange(habit.id, 'rangeMax', parseInt(e.target.value)),
                                            className: "w-full mt-1 p-2 rounded-md bg-background border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/EditHabitsModal.tsx",
                                            lineNumber: 57,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/EditHabitsModal.tsx",
                                    lineNumber: 55,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-xs text-text-secondary",
                                            children: "Monthly Target"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/EditHabitsModal.tsx",
                                            lineNumber: 65,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            value: habit.target,
                                            onChange: (e)=>handleHabitChange(habit.id, 'target', parseInt(e.target.value)),
                                            className: "w-full mt-1 p-2 rounded-md bg-background border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/EditHabitsModal.tsx",
                                            lineNumber: 66,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/EditHabitsModal.tsx",
                                    lineNumber: 64,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-1 flex items-end",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleDeleteHabit(habit.id),
                                        className: "text-red-500 hover:text-red-400 p-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            xmlns: "http://www.w3.org/2000/svg",
                                            width: "20",
                                            height: "20",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                    points: "3 6 5 6 21 6"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/EditHabitsModal.tsx",
                                                    lineNumber: 75,
                                                    columnNumber: 216
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/EditHabitsModal.tsx",
                                                    lineNumber: 75,
                                                    columnNumber: 249
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "10",
                                                    y1: "11",
                                                    x2: "10",
                                                    y2: "17"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/EditHabitsModal.tsx",
                                                    lineNumber: 75,
                                                    columnNumber: 339
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "14",
                                                    y1: "11",
                                                    x2: "14",
                                                    y2: "17"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/EditHabitsModal.tsx",
                                                    lineNumber: 75,
                                                    columnNumber: 378
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/EditHabitsModal.tsx",
                                            lineNumber: 75,
                                            columnNumber: 38
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/EditHabitsModal.tsx",
                                        lineNumber: 74,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/EditHabitsModal.tsx",
                                    lineNumber: 73,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, habit.id, true, {
                            fileName: "[project]/src/components/EditHabitsModal.tsx",
                            lineNumber: 45,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)))
                }, void 0, false, {
                    fileName: "[project]/src/components/EditHabitsModal.tsx",
                    lineNumber: 43,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-6 pt-6 border-t border-border flex justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            onClick: handleAddHabit,
                            className: "bg-transparent border border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white",
                            children: "Add Habit"
                        }, void 0, false, {
                            fileName: "[project]/src/components/EditHabitsModal.tsx",
                            lineNumber: 83,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex space-x-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    onClick: onClose,
                                    className: "bg-input-bg text-text-primary hover:bg-border",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/EditHabitsModal.tsx",
                                    lineNumber: 85,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    onClick: handleSave,
                                    children: "Save Changes"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/EditHabitsModal.tsx",
                                    lineNumber: 86,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/EditHabitsModal.tsx",
                            lineNumber: 84,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/EditHabitsModal.tsx",
                    lineNumber: 82,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/EditHabitsModal.tsx",
            lineNumber: 37,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/EditHabitsModal.tsx",
        lineNumber: 33,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(EditHabitsModal, "0pbydCtlfcA0xFonFspKNv/CEJg=");
_c = EditHabitsModal;
const __TURBOPACK__default__export__ = EditHabitsModal;
var _c;
__turbopack_context__.k.register(_c, "EditHabitsModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/EditRulesModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/v4.js [app-client] (ecmascript) <export default as v4>");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const EditRulesModal = ({ rules, setRules, onClose })=>{
    _s();
    const [localRules, setLocalRules] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(JSON.parse(JSON.stringify(rules)));
    const handleRuleChange = (id, field, value)=>{
        setLocalRules((prev)=>prev.map((r)=>r.id === id ? {
                    ...r,
                    [field]: value
                } : r));
    };
    const handleAddRule = ()=>{
        setLocalRules((prev)=>[
                ...prev,
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
                    activity: 'New Activity',
                    maxPoints: 10,
                    penaltyRule: '',
                    zeroPointsCondition: '',
                    scoringLogic: ''
                }
            ]);
    };
    const handleDeleteRule = (id)=>{
        setLocalRules((prev)=>prev.filter((r)=>r.id !== id));
    };
    const handleSave = ()=>{
        setRules(localRules);
        onClose();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in",
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-card-bg p-8 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col",
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-2xl font-bold mb-6 text-text-primary",
                    children: "Edit Scoring Rules"
                }, void 0, false, {
                    fileName: "[project]/src/components/EditRulesModal.tsx",
                    lineNumber: 41,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "overflow-y-auto pr-4 -mr-4 space-y-4",
                    children: localRules.map((rule)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-3 bg-input-bg rounded-lg space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-12 gap-4 items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "col-span-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-xs text-text-secondary",
                                                    children: "Activity"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/EditRulesModal.tsx",
                                                    lineNumber: 48,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: rule.activity,
                                                    onChange: (e)=>handleRuleChange(rule.id, 'activity', e.target.value),
                                                    className: "w-full mt-1 p-2 rounded-md bg-background border border-border text-text-primary"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/EditRulesModal.tsx",
                                                    lineNumber: 49,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/EditRulesModal.tsx",
                                            lineNumber: 47,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "col-span-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-xs text-text-secondary",
                                                    children: "Max Points"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/EditRulesModal.tsx",
                                                    lineNumber: 52,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    value: rule.maxPoints,
                                                    onChange: (e)=>handleRuleChange(rule.id, 'maxPoints', parseInt(e.target.value)),
                                                    className: "w-full mt-1 p-2 rounded-md bg-background border border-border text-text-primary"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/EditRulesModal.tsx",
                                                    lineNumber: 53,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/EditRulesModal.tsx",
                                            lineNumber: 51,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "col-span-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-xs text-text-secondary",
                                                    children: "Penalty Rule"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/EditRulesModal.tsx",
                                                    lineNumber: 56,
                                                    columnNumber: 38
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: rule.penaltyRule,
                                                    onChange: (e)=>handleRuleChange(rule.id, 'penaltyRule', e.target.value),
                                                    className: "w-full mt-1 p-2 rounded-md bg-background border border-border text-text-primary"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/EditRulesModal.tsx",
                                                    lineNumber: 57,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/EditRulesModal.tsx",
                                            lineNumber: 55,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "col-span-1 flex items-end",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleDeleteRule(rule.id),
                                                className: "text-red-500 hover:text-red-400 p-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    xmlns: "http://www.w3.org/2000/svg",
                                                    width: "20",
                                                    height: "20",
                                                    viewBox: "0 0 24 24",
                                                    fill: "none",
                                                    stroke: "currentColor",
                                                    strokeWidth: "2",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                            points: "3 6 5 6 21 6"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/EditRulesModal.tsx",
                                                            lineNumber: 61,
                                                            columnNumber: 219
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/EditRulesModal.tsx",
                                                            lineNumber: 61,
                                                            columnNumber: 252
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                            x1: "10",
                                                            y1: "11",
                                                            x2: "10",
                                                            y2: "17"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/EditRulesModal.tsx",
                                                            lineNumber: 61,
                                                            columnNumber: 342
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                            x1: "14",
                                                            y1: "11",
                                                            x2: "14",
                                                            y2: "17"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/EditRulesModal.tsx",
                                                            lineNumber: 61,
                                                            columnNumber: 381
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/EditRulesModal.tsx",
                                                    lineNumber: 61,
                                                    columnNumber: 41
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/EditRulesModal.tsx",
                                                lineNumber: 60,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/EditRulesModal.tsx",
                                            lineNumber: 59,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/EditRulesModal.tsx",
                                    lineNumber: 46,
                                    columnNumber: 30
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-xs text-text-secondary",
                                                    children: "0 Points Condition"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/EditRulesModal.tsx",
                                                    lineNumber: 67,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: rule.zeroPointsCondition,
                                                    onChange: (e)=>handleRuleChange(rule.id, 'zeroPointsCondition', e.target.value),
                                                    className: "w-full mt-1 p-2 rounded-md bg-background border border-border text-text-primary"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/EditRulesModal.tsx",
                                                    lineNumber: 68,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/EditRulesModal.tsx",
                                            lineNumber: 66,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-xs text-text-secondary",
                                                    children: "Scoring Logic / Notes"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/EditRulesModal.tsx",
                                                    lineNumber: 71,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: rule.scoringLogic,
                                                    onChange: (e)=>handleRuleChange(rule.id, 'scoringLogic', e.target.value),
                                                    className: "w-full mt-1 p-2 rounded-md bg-background border border-border text-text-primary"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/EditRulesModal.tsx",
                                                    lineNumber: 72,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/EditRulesModal.tsx",
                                            lineNumber: 70,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/EditRulesModal.tsx",
                                    lineNumber: 65,
                                    columnNumber: 31
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, rule.id, true, {
                            fileName: "[project]/src/components/EditRulesModal.tsx",
                            lineNumber: 45,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)))
                }, void 0, false, {
                    fileName: "[project]/src/components/EditRulesModal.tsx",
                    lineNumber: 43,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-6 pt-6 border-t border-border flex justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            onClick: handleAddRule,
                            className: "bg-transparent border border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white",
                            children: "Add Rule"
                        }, void 0, false, {
                            fileName: "[project]/src/components/EditRulesModal.tsx",
                            lineNumber: 80,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex space-x-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    onClick: onClose,
                                    className: "bg-input-bg text-text-primary hover:bg-border",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/EditRulesModal.tsx",
                                    lineNumber: 82,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    onClick: handleSave,
                                    children: "Save Changes"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/EditRulesModal.tsx",
                                    lineNumber: 83,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/EditRulesModal.tsx",
                            lineNumber: 81,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/EditRulesModal.tsx",
                    lineNumber: 79,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/EditRulesModal.tsx",
            lineNumber: 37,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/EditRulesModal.tsx",
        lineNumber: 33,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(EditRulesModal, "FNrbUoQs1MIxcJeh2kI4Tb3T8yY=");
_c = EditRulesModal;
const __TURBOPACK__default__export__ = EditRulesModal;
var _c;
__turbopack_context__.k.register(_c, "EditRulesModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ToolsProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ToolsProvider",
    ()=>ToolsProvider,
    "useTools",
    ()=>useTools
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
const ToolsContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const useTools = ()=>{
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ToolsContext);
    if (!context) {
        throw new Error('useTools must be used within a ToolsProvider');
    }
    return context;
};
_s(useTools, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const ToolsProvider = ({ children })=>{
    _s1();
    const [openTools, setOpenTools] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const openTool = (toolId)=>{
        setOpenTools((prev)=>{
            if (prev.includes(toolId)) {
                // If already open, bring to front
                return [
                    ...prev.filter((t)=>t !== toolId),
                    toolId
                ];
            }
            return [
                ...prev,
                toolId
            ];
        });
    };
    const closeTool = (toolId)=>{
        setOpenTools((prev)=>prev.filter((t)=>t !== toolId));
    };
    const focusTool = (toolId)=>{
        setOpenTools((prev)=>{
            if (prev.includes(toolId) && prev[prev.length - 1] !== toolId) {
                // Bring to front
                return [
                    ...prev.filter((t)=>t !== toolId),
                    toolId
                ];
            }
            return prev;
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ToolsContext.Provider, {
        value: {
            openTools,
            openTool,
            closeTool,
            focusTool
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ToolsProvider.tsx",
        lineNumber: 49,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(ToolsProvider, "UkXqt4K/wFdSPavKJ2NBBp9NtBk=");
_c = ToolsProvider;
var _c;
__turbopack_context__.k.register(_c, "ToolsProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/common/FloatingTools.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ToolsProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ToolsProvider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
// Icons for the tools
const CalculatorIcon = (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "4",
                y: "2",
                width: "16",
                height: "20",
                rx: "2",
                ry: "2"
            }, void 0, false, {
                fileName: "[project]/src/components/common/FloatingTools.tsx",
                lineNumber: 7,
                columnNumber: 191
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "8",
                y1: "6",
                x2: "16",
                y2: "6"
            }, void 0, false, {
                fileName: "[project]/src/components/common/FloatingTools.tsx",
                lineNumber: 7,
                columnNumber: 247
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "16",
                y1: "14",
                x2: "16",
                y2: "18"
            }, void 0, false, {
                fileName: "[project]/src/components/common/FloatingTools.tsx",
                lineNumber: 7,
                columnNumber: 283
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "10",
                x2: "12",
                y2: "18"
            }, void 0, false, {
                fileName: "[project]/src/components/common/FloatingTools.tsx",
                lineNumber: 7,
                columnNumber: 322
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "8",
                y1: "10",
                x2: "8",
                y2: "18"
            }, void 0, false, {
                fileName: "[project]/src/components/common/FloatingTools.tsx",
                lineNumber: 7,
                columnNumber: 361
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/common/FloatingTools.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c = CalculatorIcon;
const ClockIcon = (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "10"
            }, void 0, false, {
                fileName: "[project]/src/components/common/FloatingTools.tsx",
                lineNumber: 10,
                columnNumber: 191
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "12 6 12 12 16 14"
            }, void 0, false, {
                fileName: "[project]/src/components/common/FloatingTools.tsx",
                lineNumber: 10,
                columnNumber: 223
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/common/FloatingTools.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c1 = ClockIcon;
const ChatIcon = (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        }, void 0, false, {
            fileName: "[project]/src/components/common/FloatingTools.tsx",
            lineNumber: 13,
            columnNumber: 191
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/common/FloatingTools.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c2 = ChatIcon;
const PlusIcon = (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "5",
                x2: "12",
                y2: "19"
            }, void 0, false, {
                fileName: "[project]/src/components/common/FloatingTools.tsx",
                lineNumber: 16,
                columnNumber: 191
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "5",
                y1: "12",
                x2: "19",
                y2: "12"
            }, void 0, false, {
                fileName: "[project]/src/components/common/FloatingTools.tsx",
                lineNumber: 16,
                columnNumber: 235
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/common/FloatingTools.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c3 = PlusIcon;
const tools = [
    {
        id: 'calculator',
        icon: CalculatorIcon,
        label: 'Calculator'
    },
    {
        id: 'clock',
        icon: ClockIcon,
        label: 'Clock'
    },
    {
        id: 'chat',
        icon: ChatIcon,
        label: 'AI Assistant'
    }
];
const FloatingTools = ()=>{
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { openTool } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ToolsProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTools"])();
    const handleToolClick = (toolId)=>{
        openTool(toolId);
        setIsOpen(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed bottom-8 right-8 z-50",
        children: [
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center space-y-3 mb-4",
                children: tools.map((tool, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>handleToolClick(tool.id),
                        className: "w-14 h-14 rounded-full bg-card-bg border border-border text-text-primary flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-accent-primary animate-fade-in",
                        style: {
                            animationDelay: `${(tools.length - index) * 50}ms`,
                            opacity: 0
                        },
                        title: tool.label,
                        "aria-label": tool.label,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(tool.icon, {
                            className: "w-6 h-6"
                        }, void 0, false, {
                            fileName: "[project]/src/components/common/FloatingTools.tsx",
                            lineNumber: 47,
                            columnNumber: 29
                        }, ("TURBOPACK compile-time value", void 0))
                    }, tool.id, false, {
                        fileName: "[project]/src/components/common/FloatingTools.tsx",
                        lineNumber: 39,
                        columnNumber: 25
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/src/components/common/FloatingTools.tsx",
                lineNumber: 37,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setIsOpen((prev)=>!prev),
                className: "w-16 h-16 rounded-full bg-accent-primary text-white flex items-center justify-center shadow-2xl transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary focus:ring-offset-background",
                "aria-label": isOpen ? "Close tools menu" : "Open tools menu",
                "aria-expanded": isOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PlusIcon, {
                    className: `w-8 h-8 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`
                }, void 0, false, {
                    fileName: "[project]/src/components/common/FloatingTools.tsx",
                    lineNumber: 58,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/common/FloatingTools.tsx",
                lineNumber: 52,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/common/FloatingTools.tsx",
        lineNumber: 35,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(FloatingTools, "n8nPGMO2ewGdeJn/zdk1Oopc1sE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ToolsProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTools"]
    ];
});
_c4 = FloatingTools;
const __TURBOPACK__default__export__ = FloatingTools;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "CalculatorIcon");
__turbopack_context__.k.register(_c1, "ClockIcon");
__turbopack_context__.k.register(_c2, "ChatIcon");
__turbopack_context__.k.register(_c3, "PlusIcon");
__turbopack_context__.k.register(_c4, "FloatingTools");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/common/DraggableResizableModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
const DraggableResizableModal = ({ title, children, onClose, initialSize = {
    width: 400,
    height: 500
}, initialPosition = {
    x: window.innerWidth / 2 - 200,
    y: window.innerHeight / 2 - 250
}, zIndex, onFocus })=>{
    _s();
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialPosition);
    const [size, setSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialSize);
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const modalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleDragStart = (e)=>{
        if (e.target.closest('button, input, textarea, select')) return;
        setIsDragging(true);
        dragStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            posX: position.x,
            posY: position.y
        };
        onFocus();
    };
    const handleDrag = (e)=>{
        if (!isDragging || !dragStartRef.current) return;
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        const newX = dragStartRef.current.posX + dx;
        const newY = dragStartRef.current.posY + dy;
        setPosition({
            x: Math.max(0, Math.min(newX, window.innerWidth - size.width)),
            y: Math.max(0, Math.min(newY, window.innerHeight - size.height))
        });
    };
    const handleDragEnd = ()=>{
        setIsDragging(false);
        dragStartRef.current = null;
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DraggableResizableModal.useEffect": ()=>{
            if (isDragging) {
                window.addEventListener('mousemove', handleDrag);
                window.addEventListener('mouseup', handleDragEnd);
            }
            return ({
                "DraggableResizableModal.useEffect": ()=>{
                    window.removeEventListener('mousemove', handleDrag);
                    window.removeEventListener('mouseup', handleDragEnd);
                }
            })["DraggableResizableModal.useEffect"];
        }
    }["DraggableResizableModal.useEffect"], [
        isDragging
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: modalRef,
        className: "fixed bg-card-bg border border-border rounded-xl shadow-2xl flex flex-col animate-fade-in",
        style: {
            top: position.y,
            left: position.x,
            width: size.width,
            height: size.height,
            zIndex
        },
        onMouseDown: onFocus,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-10 bg-sidebar-bg rounded-t-xl flex items-center justify-between px-4 cursor-move",
                onMouseDown: handleDragStart,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-bold text-text-primary",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/common/DraggableResizableModal.tsx",
                        lineNumber: 87,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        className: "w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold hover:bg-red-600",
                        "aria-label": "Close",
                        children: "✕"
                    }, void 0, false, {
                        fileName: "[project]/src/components/common/DraggableResizableModal.tsx",
                        lineNumber: 88,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/common/DraggableResizableModal.tsx",
                lineNumber: 83,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-grow p-4 overflow-auto",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/common/DraggableResizableModal.tsx",
                lineNumber: 96,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/common/DraggableResizableModal.tsx",
        lineNumber: 71,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(DraggableResizableModal, "9kJpGRNObzg1D65g6GdcZRwVuD0=");
_c = DraggableResizableModal;
const __TURBOPACK__default__export__ = DraggableResizableModal;
var _c;
__turbopack_context__.k.register(_c, "DraggableResizableModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/tools/Calculator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
const Calculator = ()=>{
    _s();
    const [display, setDisplay] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('0');
    const [isFinanceMode, setIsFinanceMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isComputing, setIsComputing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [operation, setOperation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showHelp, setShowHelp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const financeValues = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        N: null,
        IY: null,
        PV: null,
        PMT: null,
        FV: null
    });
    const handleInput = (value)=>{
        if (display.length >= 16) return;
        if (operation && !display.includes(' ')) {
            setDisplay(value);
        } else if (display === '0' && value !== '.') {
            setDisplay(value);
        } else if (value === '.' && display.includes('.')) {
            return;
        } else {
            setDisplay(display + value);
        }
    };
    const handleBackspace = ()=>{
        setDisplay((prev)=>prev.length > 1 ? prev.slice(0, -1) : '0');
    };
    const handleOperator = (op)=>{
        // Prevent adding operator if display ends with one
        if (/\s[+\-*/]\s$/.test(display)) return;
        setOperation(op);
        setDisplay(display + ` ${op} `);
    };
    const handleEquals = ()=>{
        try {
            const result = new Function('return ' + display.replace(/[^0-9+\-*/. ]/g, ''))();
            setDisplay(String(result));
            setOperation(null);
        } catch (e) {
            setDisplay('Error');
        }
    };
    const handleClear = ()=>{
        setDisplay('0');
        setOperation(null);
    };
    const handleFinanceKey = (key)=>{
        if (isComputing) {
            computeFinance(key);
            setIsComputing(false);
        } else {
            const value = parseFloat(display);
            if (!isNaN(value)) {
                financeValues.current[key] = value;
                setDisplay('0');
                forceUpdate();
            }
        }
    };
    const computeFinance = (key)=>{
        const { N, IY, PV, PMT, FV } = financeValues.current;
        const r = IY !== null ? IY / 100 / 12 : null;
        let result = 'Error';
        try {
            switch(key){
                case 'PMT':
                    if (PV !== null && r !== null && N !== null) result = r === 0 ? -(PV + (FV || 0)) / N : -(PV * Math.pow(1 + r, N) + (FV || 0)) / ((Math.pow(1 + r, N) - 1) / r);
                    break;
                case 'PV':
                    if (PMT !== null && r !== null && N !== null) result = r === 0 ? -(FV || 0) - PMT * N : -((FV || 0) + PMT * (Math.pow(1 + r, N) - 1) / r) / Math.pow(1 + r, N);
                    break;
                case 'FV':
                    if (PV !== null && r !== null && N !== null) result = -(PV * Math.pow(1 + r, N) + (PMT || 0) * (Math.pow(1 + r, N) - 1) / (r || 1e-9));
                    break;
                case 'N':
                    if (PMT !== null && r !== null && PV !== null) result = r === 0 ? -(PV + (FV || 0)) / PMT : Math.log((PMT - (FV || 0) * r) / (PMT + PV * r)) / Math.log(1 + r);
                    break;
                case 'IY':
                    result = 'Auto I/Y not supported';
                    break;
            }
            financeValues.current[key] = typeof result === 'number' ? result : null;
            setDisplay(typeof result === 'number' ? result.toFixed(2) : result);
        } catch  {
            setDisplay('Math Error');
        }
    };
    const [, updateState] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState({});
    const forceUpdate = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useCallback({
        "Calculator.useCallback[forceUpdate]": ()=>updateState({})
    }["Calculator.useCallback[forceUpdate]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Calculator.useEffect": ()=>{
            const handleKeyDown = {
                "Calculator.useEffect.handleKeyDown": (e)=>{
                    if (e.target.closest('input, textarea')) return;
                    e.preventDefault();
                    const key = e.key;
                    if (key >= '0' && key <= '9' || key === '.') handleInput(key);
                    if ([
                        '+',
                        '-',
                        '*',
                        '/'
                    ].includes(key)) handleOperator(key);
                    if (key === 'Enter' || key === '=') handleEquals();
                    if (key === 'Escape') handleClear();
                    if (key === 'Backspace') handleBackspace();
                }
            }["Calculator.useEffect.handleKeyDown"];
            window.addEventListener('keydown', handleKeyDown);
            return ({
                "Calculator.useEffect": ()=>window.removeEventListener('keydown', handleKeyDown)
            })["Calculator.useEffect"];
        }
    }["Calculator.useEffect"], [
        display,
        operation
    ]);
    const HelpOverlay = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute inset-0 bg-card-bg/95 backdrop-blur-sm p-4 z-10 flex flex-col animate-fade-in text-sm text-text-secondary",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-center mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "font-bold text-lg text-text-primary",
                            children: "Calculator Help"
                        }, void 0, false, {
                            fileName: "[project]/src/components/tools/Calculator.tsx",
                            lineNumber: 119,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowHelp(false),
                            className: "w-8 h-8 rounded-full bg-input-bg flex items-center justify-center hover:bg-border text-lg",
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/src/components/tools/Calculator.tsx",
                            lineNumber: 120,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/tools/Calculator.tsx",
                    lineNumber: 118,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "overflow-y-auto space-y-4 pr-2 -mr-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "font-bold text-text-primary mb-1",
                                    children: "General Use"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/tools/Calculator.tsx",
                                    lineNumber: 124,
                                    columnNumber: 21
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Use your mouse or keyboard for input. Supported keys: `0-9`, `.`, `+`, `-`, `*`, `/`, `Enter` (=), `Backspace`, `Escape` (AC)."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/tools/Calculator.tsx",
                                    lineNumber: 125,
                                    columnNumber: 21
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/tools/Calculator.tsx",
                            lineNumber: 123,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "font-bold text-text-primary mb-1",
                                    children: "Standard Mode"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/tools/Calculator.tsx",
                                    lineNumber: 128,
                                    columnNumber: 21
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "`AC` (All Clear): Resets the calculation. `C` (Backspace): Deletes the last character."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/tools/Calculator.tsx",
                                    lineNumber: 129,
                                    columnNumber: 21
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/tools/Calculator.tsx",
                            lineNumber: 127,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "font-bold text-text-primary mb-1",
                                    children: "Finance Mode"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/tools/Calculator.tsx",
                                    lineNumber: 132,
                                    columnNumber: 21
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "A Time Value of Money (TVM) solver. Enter known values first, then compute the unknown."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/tools/Calculator.tsx",
                                    lineNumber: 133,
                                    columnNumber: 21
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "list-disc list-inside mt-2 space-y-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: "To Store a Value:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/tools/Calculator.tsx",
                                                    lineNumber: 135,
                                                    columnNumber: 29
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Type a number, then press a finance key (N, IY, etc.)."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/tools/Calculator.tsx",
                                            lineNumber: 135,
                                            columnNumber: 25
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: "To Compute a Value:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/tools/Calculator.tsx",
                                                    lineNumber: 136,
                                                    columnNumber: 29
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Press `CMPT`, then press the key for the value you want to calculate."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/tools/Calculator.tsx",
                                            lineNumber: 136,
                                            columnNumber: 25
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/tools/Calculator.tsx",
                                    lineNumber: 134,
                                    columnNumber: 21
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/tools/Calculator.tsx",
                            lineNumber: 131,
                            columnNumber: 18
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "font-bold text-text-primary mb-1",
                                    children: "Finance Keys"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/tools/Calculator.tsx",
                                    lineNumber: 140,
                                    columnNumber: 21
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "list-disc list-inside mt-2 space-y-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: "N:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/tools/Calculator.tsx",
                                                    lineNumber: 142,
                                                    columnNumber: 29
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Total number of payment periods."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/tools/Calculator.tsx",
                                            lineNumber: 142,
                                            columnNumber: 25
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: "I/Y:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/tools/Calculator.tsx",
                                                    lineNumber: 143,
                                                    columnNumber: 29
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Annual interest rate (e.g., enter 5 for 5%)."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/tools/Calculator.tsx",
                                            lineNumber: 143,
                                            columnNumber: 25
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: "PV:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/tools/Calculator.tsx",
                                                    lineNumber: 144,
                                                    columnNumber: 29
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Present Value (e.g., loan amount)."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/tools/Calculator.tsx",
                                            lineNumber: 144,
                                            columnNumber: 25
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: "PMT:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/tools/Calculator.tsx",
                                                    lineNumber: 145,
                                                    columnNumber: 29
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Payment per period."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/tools/Calculator.tsx",
                                            lineNumber: 145,
                                            columnNumber: 25
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: "FV:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/tools/Calculator.tsx",
                                                    lineNumber: 146,
                                                    columnNumber: 29
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Future Value."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/tools/Calculator.tsx",
                                            lineNumber: 146,
                                            columnNumber: 25
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/tools/Calculator.tsx",
                                    lineNumber: 141,
                                    columnNumber: 21
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/tools/Calculator.tsx",
                            lineNumber: 139,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/tools/Calculator.tsx",
                    lineNumber: 122,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/tools/Calculator.tsx",
            lineNumber: 117,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0));
    const renderStandardButtons = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-4 gap-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    title: "All Clear: Resets the calculator",
                    onClick: handleClear,
                    className: "col-span-2 bg-red-500/50 hover:bg-red-500/70 p-4 rounded-lg",
                    children: "AC"
                }, void 0, false, {
                    fileName: "[project]/src/components/tools/Calculator.tsx",
                    lineNumber: 155,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    title: "Backspace: Deletes the last character",
                    onClick: handleBackspace,
                    className: "bg-input-bg hover:bg-border p-4 rounded-lg",
                    children: "C"
                }, void 0, false, {
                    fileName: "[project]/src/components/tools/Calculator.tsx",
                    lineNumber: 156,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    title: "Divide",
                    onClick: ()=>handleOperator('/'),
                    className: "bg-input-bg hover:bg-border p-4 rounded-lg",
                    children: "/"
                }, void 0, false, {
                    fileName: "[project]/src/components/tools/Calculator.tsx",
                    lineNumber: 157,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                '789'.split('').map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        title: `Number ${n}`,
                        onClick: ()=>handleInput(n),
                        className: "bg-sidebar-bg hover:bg-border p-4 rounded-lg",
                        children: n
                    }, n, false, {
                        fileName: "[project]/src/components/tools/Calculator.tsx",
                        lineNumber: 158,
                        columnNumber: 39
                    }, ("TURBOPACK compile-time value", void 0))),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    title: "Multiply",
                    onClick: ()=>handleOperator('*'),
                    className: "bg-input-bg hover:bg-border p-4 rounded-lg",
                    children: "*"
                }, void 0, false, {
                    fileName: "[project]/src/components/tools/Calculator.tsx",
                    lineNumber: 159,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                '456'.split('').map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        title: `Number ${n}`,
                        onClick: ()=>handleInput(n),
                        className: "bg-sidebar-bg hover:bg-border p-4 rounded-lg",
                        children: n
                    }, n, false, {
                        fileName: "[project]/src/components/tools/Calculator.tsx",
                        lineNumber: 160,
                        columnNumber: 39
                    }, ("TURBOPACK compile-time value", void 0))),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    title: "Subtract",
                    onClick: ()=>handleOperator('-'),
                    className: "bg-input-bg hover:bg-border p-4 rounded-lg",
                    children: "-"
                }, void 0, false, {
                    fileName: "[project]/src/components/tools/Calculator.tsx",
                    lineNumber: 161,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                '123'.split('').map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        title: `Number ${n}`,
                        onClick: ()=>handleInput(n),
                        className: "bg-sidebar-bg hover:bg-border p-4 rounded-lg",
                        children: n
                    }, n, false, {
                        fileName: "[project]/src/components/tools/Calculator.tsx",
                        lineNumber: 162,
                        columnNumber: 39
                    }, ("TURBOPACK compile-time value", void 0))),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    title: "Add",
                    onClick: ()=>handleOperator('+'),
                    className: "bg-input-bg hover:bg-border p-4 rounded-lg",
                    children: "+"
                }, void 0, false, {
                    fileName: "[project]/src/components/tools/Calculator.tsx",
                    lineNumber: 163,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    title: "Number 0",
                    onClick: ()=>handleInput('0'),
                    className: "bg-sidebar-bg hover:bg-border p-4 rounded-lg",
                    children: "0"
                }, void 0, false, {
                    fileName: "[project]/src/components/tools/Calculator.tsx",
                    lineNumber: 164,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    title: "Decimal Point",
                    onClick: ()=>handleInput('.'),
                    className: "bg-sidebar-bg hover:bg-border p-4 rounded-lg",
                    children: "."
                }, void 0, false, {
                    fileName: "[project]/src/components/tools/Calculator.tsx",
                    lineNumber: 165,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    title: "Equals: Calculate the result",
                    onClick: handleEquals,
                    className: "col-span-2 bg-accent-primary hover:bg-accent-primary-dark p-4 rounded-lg",
                    children: "="
                }, void 0, false, {
                    fileName: "[project]/src/components/tools/Calculator.tsx",
                    lineNumber: 166,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/tools/Calculator.tsx",
            lineNumber: 154,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0));
    const renderFinanceButtons = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-3 gap-2 text-sm flex-grow",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    title: "Number of Periods",
                    onClick: ()=>handleFinanceKey('N'),
                    className: "bg-input-bg hover:bg-border p-3 rounded-lg",
                    children: "N"
                }, void 0, false, {
                    fileName: "[project]/src/components/tools/Calculator.tsx",
                    lineNumber: 172,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    title: "Interest Rate per Year",
                    onClick: ()=>handleFinanceKey('IY'),
                    className: "bg-input-bg hover:bg-border p-3 rounded-lg",
                    children: "I/Y"
                }, void 0, false, {
                    fileName: "[project]/src/components/tools/Calculator.tsx",
                    lineNumber: 173,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    title: "Present Value",
                    onClick: ()=>handleFinanceKey('PV'),
                    className: "bg-input-bg hover:bg-border p-3 rounded-lg",
                    children: "PV"
                }, void 0, false, {
                    fileName: "[project]/src/components/tools/Calculator.tsx",
                    lineNumber: 174,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    title: "Payment per Period",
                    onClick: ()=>handleFinanceKey('PMT'),
                    className: "bg-input-bg hover:bg-border p-3 rounded-lg",
                    children: "PMT"
                }, void 0, false, {
                    fileName: "[project]/src/components/tools/Calculator.tsx",
                    lineNumber: 175,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    title: "Future Value",
                    onClick: ()=>handleFinanceKey('FV'),
                    className: "bg-input-bg hover:bg-border p-3 rounded-lg",
                    children: "FV"
                }, void 0, false, {
                    fileName: "[project]/src/components/tools/Calculator.tsx",
                    lineNumber: 176,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    title: "Compute: Press this, then the key for the value to solve.",
                    onClick: ()=>setIsComputing(true),
                    className: `p-3 rounded-lg ${isComputing ? 'bg-green-500 animate-pulse' : 'bg-accent-primary hover:bg-accent-primary-dark'}`,
                    children: "CMPT"
                }, void 0, false, {
                    fileName: "[project]/src/components/tools/Calculator.tsx",
                    lineNumber: 177,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/tools/Calculator.tsx",
            lineNumber: 171,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0));
    const renderFinanceDisplay = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-5 gap-1 text-center text-xs text-text-secondary mb-2",
            children: [
                'N',
                'IY',
                'PV',
                'PMT',
                'FV'
            ].map((key)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-sidebar-bg/50 p-1 rounded",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "font-bold",
                            children: key
                        }, void 0, false, {
                            fileName: "[project]/src/components/tools/Calculator.tsx",
                            lineNumber: 185,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: financeValues.current[key]?.toLocaleString(undefined, {
                                maximumFractionDigits: 2
                            }) ?? '-'
                        }, void 0, false, {
                            fileName: "[project]/src/components/tools/Calculator.tsx",
                            lineNumber: 186,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, key, true, {
                    fileName: "[project]/src/components/tools/Calculator.tsx",
                    lineNumber: 184,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)))
        }, void 0, false, {
            fileName: "[project]/src/components/tools/Calculator.tsx",
            lineNumber: 182,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative h-full flex flex-col font-mono text-text-primary text-lg",
        children: [
            showHelp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HelpOverlay, {}, void 0, false, {
                fileName: "[project]/src/components/tools/Calculator.tsx",
                lineNumber: 194,
                columnNumber: 27
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-end items-center mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowHelp(true),
                        className: "w-6 h-6 rounded-full border border-text-secondary text-text-secondary flex items-center justify-center text-sm font-bold hover:bg-border hover:text-text-primary mr-4",
                        title: "Show Help",
                        children: "i"
                    }, void 0, false, {
                        fileName: "[project]/src/components/tools/Calculator.tsx",
                        lineNumber: 196,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs mr-2",
                        children: "Finance Mode"
                    }, void 0, false, {
                        fileName: "[project]/src/components/tools/Calculator.tsx",
                        lineNumber: 203,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "relative inline-flex items-center cursor-pointer",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "checkbox",
                                checked: isFinanceMode,
                                onChange: ()=>setIsFinanceMode(!isFinanceMode),
                                className: "sr-only peer"
                            }, void 0, false, {
                                fileName: "[project]/src/components/tools/Calculator.tsx",
                                lineNumber: 205,
                                columnNumber: 19
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-11 h-6 bg-input-bg rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"
                            }, void 0, false, {
                                fileName: "[project]/src/components/tools/Calculator.tsx",
                                lineNumber: 206,
                                columnNumber: 19
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/tools/Calculator.tsx",
                        lineNumber: 204,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/tools/Calculator.tsx",
                lineNumber: 195,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0)),
            isFinanceMode && renderFinanceDisplay(),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-background p-4 rounded-lg text-right text-3xl mb-4 break-words h-20 flex items-end justify-end",
                children: display
            }, void 0, false, {
                fileName: "[project]/src/components/tools/Calculator.tsx",
                lineNumber: 210,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-grow flex flex-col",
                children: isFinanceMode ? renderFinanceButtons() : renderStandardButtons()
            }, void 0, false, {
                fileName: "[project]/src/components/tools/Calculator.tsx",
                lineNumber: 211,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/tools/Calculator.tsx",
        lineNumber: 193,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Calculator, "gev04UuZAozLbhnI4FWXrUIoO0k=");
_c = Calculator;
const __TURBOPACK__default__export__ = Calculator;
var _c;
__turbopack_context__.k.register(_c, "Calculator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/tools/Clock.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
const AnalogClock = ({ time, onToggleView })=>{
    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours();
    const secondDeg = seconds / 60 * 360;
    const minuteDeg = minutes / 60 * 360 + seconds / 60 * 6;
    const hourDeg = hours % 12 / 12 * 360 + minutes / 60 * 30;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-64 h-64 rounded-full bg-sidebar-bg border-4 border-border relative mx-auto my-4 cursor-pointer select-none",
        onClick: onToggleView,
        title: "Switch to Digital View",
        children: [
            Array.from({
                length: 12
            }, (_, i)=>{
                const hour = i + 1;
                const angle = hour * 30;
                const isMajor = hour % 3 === 0;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute w-full h-full flex justify-center",
                    style: {
                        transform: `rotate(${angle}deg)`
                    },
                    children: isMajor ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute text-xl font-bold",
                        style: {
                            top: '15px',
                            transform: `rotate(-${angle}deg)`
                        },
                        children: hour
                    }, void 0, false, {
                        fileName: "[project]/src/components/tools/Clock.tsx",
                        lineNumber: 31,
                        columnNumber: 29
                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-3 h-2 w-0.5 bg-text-secondary"
                    }, void 0, false, {
                        fileName: "[project]/src/components/tools/Clock.tsx",
                        lineNumber: 38,
                        columnNumber: 29
                    }, ("TURBOPACK compile-time value", void 0))
                }, hour, false, {
                    fileName: "[project]/src/components/tools/Clock.tsx",
                    lineNumber: 25,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0));
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-1/2 left-1/2 w-2 h-2 bg-accent-primary rounded-full -translate-x-1/2 -translate-y-1/2 z-10"
            }, void 0, false, {
                fileName: "[project]/src/components/tools/Clock.tsx",
                lineNumber: 45,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-1/2 left-1/2 h-16 w-1 bg-text-primary origin-bottom -translate-x-1/2 -translate-y-full",
                style: {
                    transform: `rotate(${hourDeg}deg)`
                }
            }, void 0, false, {
                fileName: "[project]/src/components/tools/Clock.tsx",
                lineNumber: 46,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-1/2 left-1/2 h-24 w-0.5 bg-text-secondary origin-bottom -translate-x-1/2 -translate-y-full",
                style: {
                    transform: `rotate(${minuteDeg}deg)`
                }
            }, void 0, false, {
                fileName: "[project]/src/components/tools/Clock.tsx",
                lineNumber: 47,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-1/2 left-1/2 h-24 w-px bg-red-500 origin-bottom -translate-x-1/2 -translate-y-full",
                style: {
                    transform: `rotate(${secondDeg}deg)`
                }
            }, void 0, false, {
                fileName: "[project]/src/components/tools/Clock.tsx",
                lineNumber: 48,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/tools/Clock.tsx",
        lineNumber: 13,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_c = AnalogClock;
const Clock = ()=>{
    _s();
    const [time, setTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Date());
    const [isAnalog, setIsAnalog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Clock.useEffect": ()=>{
            const timerId = setInterval({
                "Clock.useEffect.timerId": ()=>setTime(new Date())
            }["Clock.useEffect.timerId"], 1000);
            return ({
                "Clock.useEffect": ()=>clearInterval(timerId)
            })["Clock.useEffect"];
        }
    }["Clock.useEffect"], []);
    const toggleView = ()=>setIsAnalog((prev)=>!prev);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-full flex flex-col items-center justify-center text-text-primary",
        children: [
            isAnalog ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AnalogClock, {
                time: time,
                onToggleView: toggleView
            }, void 0, false, {
                fileName: "[project]/src/components/tools/Clock.tsx",
                lineNumber: 67,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "font-mono text-6xl tracking-widest cursor-pointer",
                onClick: toggleView,
                title: "Switch to Analog View",
                children: time.toLocaleTimeString()
            }, void 0, false, {
                fileName: "[project]/src/components/tools/Clock.tsx",
                lineNumber: 69,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-lg text-text-secondary mt-4",
                children: time.toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            }, void 0, false, {
                fileName: "[project]/src/components/tools/Clock.tsx",
                lineNumber: 77,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/tools/Clock.tsx",
        lineNumber: 65,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Clock, "lnpkkR/1GRf+3kQC4fKuTVWd67c=");
_c1 = Clock;
const __TURBOPACK__default__export__ = Clock;
var _c, _c1;
__turbopack_context__.k.register(_c, "AnalogClock");
__turbopack_context__.k.register(_c1, "Clock");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/tools/ChatTool.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$web$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@google/genai/dist/web/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$marked$2f$lib$2f$marked$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/marked/lib/marked.esm.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '../../App'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
// --- Icons ---
const SendIcon = (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "22",
                y1: "2",
                x2: "11",
                y2: "13"
            }, void 0, false, {
                fileName: "[project]/src/components/tools/ChatTool.tsx",
                lineNumber: 14,
                columnNumber: 191
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                points: "22 2 15 22 11 13 2 9 22 2"
            }, void 0, false, {
                fileName: "[project]/src/components/tools/ChatTool.tsx",
                lineNumber: 14,
                columnNumber: 235
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/tools/ChatTool.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c = SendIcon;
const SparkleIcon = (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M12 3L9.5 8.5 4 11l5.5 2.5L12 19l2.5-5.5L20 11l-5.5-2.5z"
        }, void 0, false, {
            fileName: "[project]/src/components/tools/ChatTool.tsx",
            lineNumber: 17,
            columnNumber: 191
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/tools/ChatTool.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c1 = SparkleIcon;
const ClearIcon = (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "18",
        height: "18",
        viewBox: "0 0 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 002-2z"
            }, void 0, false, {
                fileName: "[project]/src/components/tools/ChatTool.tsx",
                lineNumber: 20,
                columnNumber: 191
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "18",
                y1: "9",
                x2: "12",
                y2: "15"
            }, void 0, false, {
                fileName: "[project]/src/components/tools/ChatTool.tsx",
                lineNumber: 20,
                columnNumber: 249
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "9",
                x2: "18",
                y2: "15"
            }, void 0, false, {
                fileName: "[project]/src/components/tools/ChatTool.tsx",
                lineNumber: 20,
                columnNumber: 287
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/tools/ChatTool.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c2 = ClearIcon;
const CopyIcon = (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "9",
                y: "9",
                width: "13",
                height: "13",
                rx: "2",
                ry: "2"
            }, void 0, false, {
                fileName: "[project]/src/components/tools/ChatTool.tsx",
                lineNumber: 23,
                columnNumber: 191
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
            }, void 0, false, {
                fileName: "[project]/src/components/tools/ChatTool.tsx",
                lineNumber: 23,
                columnNumber: 253
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/tools/ChatTool.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c3 = CopyIcon;
const CheckIcon = (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "3",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
            points: "20 6 9 17 4 12"
        }, void 0, false, {
            fileName: "[project]/src/components/tools/ChatTool.tsx",
            lineNumber: 26,
            columnNumber: 191
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/tools/ChatTool.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c4 = CheckIcon;
const WELCOME_MESSAGE = {
    id: 'initial',
    role: 'model',
    content: "Hello! I'm your personal data assistant. I can help you analyze your progress. \n\nHere are some things you can ask:\n*   `What was my biggest expense category last month?`\n*   `Summarize my journal entries from the last 3 days.`\n*   `Which monthly goal am I falling behind on?`"
};
const ChatTool = ()=>{
    _s();
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        WELCOME_MESSAGE
    ]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // FIX: Add state to track AI initialization, as updating a ref doesn't trigger re-renders.
    const [aiInitialized, setAiInitialized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [copiedMessageId, setCopiedMessageId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const aiRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { data, today, habits, plannerData, goals, expenses, quotes } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(DataContext);
    const { scoringRules } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(SettingsContext);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatTool.useEffect": ()=>{
            try {
                aiRef.current = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$web$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GoogleGenAI"]({
                    apiKey: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.API_KEY
                });
                setAiInitialized(true);
            } catch (error) {
                console.error("Failed to initialize AI Chat:", error);
                setMessages([
                    {
                        id: 'initial-error',
                        role: 'model',
                        content: "Sorry, I couldn't connect to the AI service. Please check your API key and refresh."
                    }
                ]);
                setAiInitialized(false);
            }
        }
    }["ChatTool.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatTool.useEffect": ()=>{
            messagesEndRef.current?.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }["ChatTool.useEffect"], [
        messages,
        isLoading
    ]);
    const handleSendMessage = async (e)=>{
        e.preventDefault();
        if (!input.trim() || !aiRef.current || isLoading) return;
        const userMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: input
        };
        const newMessages = [
            ...messages,
            userMessage
        ];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);
        const modelResponseId = `model-${Date.now()}`;
        setMessages((prev)=>[
                ...prev,
                {
                    id: modelResponseId,
                    role: 'model',
                    content: ''
                }
            ]);
        try {
            const recentDailyData = Object.fromEntries(Object.entries(data).slice(-15));
            const recentExpenses = expenses.slice(-30);
            const allUserData = {
                today,
                dailyEntries: recentDailyData,
                habitsConfig: habits,
                scoringRules,
                planner: plannerData,
                goals,
                expenses: recentExpenses,
                quotes: {
                    sourceCount: quotes.length,
                    totalQuotes: quotes.reduce((acc, s)=>acc + s.quotes.length, 0),
                    sources: quotes.map((s)=>s.title)
                }
            };
            const systemInstruction = `You are a helpful and insightful AI assistant integrated into a personal tracking application. Your role is to act as a data-driven life coach. Analyze the user's data to answer their questions, provide insights, identify patterns, and offer encouragement or advice. Be friendly, concise, and helpful. Use markdown for formatting, including code blocks for lists or important points. Here is a JSON summary of the user's current data: ${JSON.stringify(allUserData, null, 2)}`;
            const historyForAPI = newMessages.filter((msg)=>msg.id !== 'initial') // Don't send the welcome message back
            .map((msg)=>({
                    role: msg.role,
                    parts: [
                        {
                            text: msg.content
                        }
                    ]
                }));
            const result = await aiRef.current.models.generateContentStream({
                model: 'gemini-2.5-flash',
                contents: historyForAPI,
                config: {
                    systemInstruction
                }
            });
            let streamedText = '';
            for await (const chunk of result){
                streamedText += chunk.text;
                setMessages((prev)=>prev.map((msg)=>msg.id === modelResponseId ? {
                            ...msg,
                            content: streamedText
                        } : msg));
            }
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = error.message || "An unknown error occurred.";
            setMessages((prev)=>prev.map((msg)=>msg.id === modelResponseId ? {
                        ...msg,
                        content: `Sorry, I encountered an error: ${errorMessage}`
                    } : msg));
        } finally{
            setIsLoading(false);
        }
    };
    const handleCopy = (content, id)=>{
        navigator.clipboard.writeText(content);
        setCopiedMessageId(id);
        setTimeout(()=>setCopiedMessageId(null), 2000);
    };
    const handleClearChat = ()=>{
        setMessages([
            WELCOME_MESSAGE
        ]);
    };
    const parsedContent = (content)=>{
        return {
            __html: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$marked$2f$lib$2f$marked$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["marked"].parse(content, {
                gfm: true,
                breaks: true
            })
        };
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-full flex flex-col text-text-primary bg-background -m-4 relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleClearChat,
                title: "Clear Chat",
                className: "absolute top-3 right-3 z-10 p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-input-bg transition-colors",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ClearIcon, {}, void 0, false, {
                    fileName: "[project]/src/components/tools/ChatTool.tsx",
                    lineNumber: 158,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/tools/ChatTool.tsx",
                lineNumber: 153,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-grow overflow-y-auto p-4 space-y-6 pt-12",
                children: [
                    messages.map((message)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`,
                            children: [
                                message.role === 'model' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-8 h-8 rounded-full bg-sidebar-bg border border-border flex items-center justify-center flex-shrink-0 text-accent-primary",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SparkleIcon, {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/tools/ChatTool.tsx",
                                        lineNumber: 165,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/tools/ChatTool.tsx",
                                    lineNumber: 164,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `group relative max-w-[80%] rounded-lg px-4 py-2 ${message.role === 'user' ? 'bg-accent-primary text-white rounded-br-none' : 'bg-sidebar-bg rounded-bl-none'}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "prose prose-invert prose-sm max-w-none",
                                            dangerouslySetInnerHTML: parsedContent(message.content || ' ')
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/tools/ChatTool.tsx",
                                            lineNumber: 169,
                                            columnNumber: 28
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        message.role === 'model' && message.id !== 'initial' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleCopy(message.content, message.id),
                                            className: "absolute -top-2 -right-2 p-1.5 bg-input-bg rounded-full text-text-secondary hover:text-text-primary opacity-0 group-hover:opacity-100 transition-opacity",
                                            children: copiedMessageId === message.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CheckIcon, {
                                                className: "text-green-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/tools/ChatTool.tsx",
                                                lineNumber: 178,
                                                columnNumber: 71
                                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CopyIcon, {}, void 0, false, {
                                                fileName: "[project]/src/components/tools/ChatTool.tsx",
                                                lineNumber: 178,
                                                columnNumber: 114
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/tools/ChatTool.tsx",
                                            lineNumber: 174,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/tools/ChatTool.tsx",
                                    lineNumber: 168,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, message.id, true, {
                            fileName: "[project]/src/components/tools/ChatTool.tsx",
                            lineNumber: 162,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))),
                    isLoading && messages[messages.length - 1]?.role === 'model' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start gap-3 justify-start",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-8 h-8 rounded-full bg-sidebar-bg border border-border flex items-center justify-center flex-shrink-0 text-accent-primary",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SparkleIcon, {
                                    className: "w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/tools/ChatTool.tsx",
                                    lineNumber: 187,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/tools/ChatTool.tsx",
                                lineNumber: 186,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-sidebar-bg rounded-lg rounded-bl-none px-4 py-3",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-center space-x-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-2 h-2 bg-text-secondary rounded-full animate-bounce [animation-delay:-0.3s]"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/tools/ChatTool.tsx",
                                            lineNumber: 191,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-2 h-2 bg-text-secondary rounded-full animate-bounce [animation-delay:-0.15s]"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/tools/ChatTool.tsx",
                                            lineNumber: 192,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-2 h-2 bg-text-secondary rounded-full animate-bounce"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/tools/ChatTool.tsx",
                                            lineNumber: 193,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/tools/ChatTool.tsx",
                                    lineNumber: 190,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/tools/ChatTool.tsx",
                                lineNumber: 189,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/tools/ChatTool.tsx",
                        lineNumber: 185,
                        columnNumber: 22
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: messagesEndRef
                    }, void 0, false, {
                        fileName: "[project]/src/components/tools/ChatTool.tsx",
                        lineNumber: 198,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/tools/ChatTool.tsx",
                lineNumber: 160,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 border-t border-border bg-background",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSendMessage,
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            value: input,
                            onChange: (e)=>setInput(e.target.value),
                            placeholder: "Ask about your data...",
                            disabled: isLoading || !aiInitialized,
                            className: "flex-grow w-full bg-input-bg rounded-full px-4 py-2 border border-transparent focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        }, void 0, false, {
                            fileName: "[project]/src/components/tools/ChatTool.tsx",
                            lineNumber: 202,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "submit",
                            disabled: isLoading || !input.trim() || !aiInitialized,
                            className: "w-10 h-10 flex items-center justify-center rounded-full bg-accent-primary text-white disabled:bg-gray-600 transition-colors",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SendIcon, {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/tools/ChatTool.tsx",
                                lineNumber: 211,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/tools/ChatTool.tsx",
                            lineNumber: 210,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/tools/ChatTool.tsx",
                    lineNumber: 201,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/tools/ChatTool.tsx",
                lineNumber: 200,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
                .prose pre {
                    background-color: var(--color-background) !important;
                    padding: 0.5rem;
                    border-radius: 0.5rem;
                    font-size: 0.8em;
                }
                .prose code {
                    color: #f5f5f5;
                    background-color: var(--color-input-bg);
                    padding: 0.1em 0.3em;
                    border-radius: 0.25rem;
                }
                .prose ul {
                    margin-top: 0.5em;
                    margin-bottom: 0.5em;
                }
                .prose p {
                    margin-top: 0.5em;
                    margin-bottom: 0.5em;
                }
             `
            }, void 0, false, {
                fileName: "[project]/src/components/tools/ChatTool.tsx",
                lineNumber: 215,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/tools/ChatTool.tsx",
        lineNumber: 152,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ChatTool, "lIWEp84+1ubTQHb3Nf1HuxCsR9k=");
_c5 = ChatTool;
const __TURBOPACK__default__export__ = ChatTool;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "SendIcon");
__turbopack_context__.k.register(_c1, "SparkleIcon");
__turbopack_context__.k.register(_c2, "ClearIcon");
__turbopack_context__.k.register(_c3, "CopyIcon");
__turbopack_context__.k.register(_c4, "CheckIcon");
__turbopack_context__.k.register(_c5, "ChatTool");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/Card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
// FIX: Updated component props to accept all standard div attributes, including onClick.
const Card = ({ children, className = '', ...props })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `bg-card-bg p-6 rounded-xl shadow-lg border border-border transition-all duration-300 hover:shadow-2xl hover:border-accent-primary/50 ${className}`,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/Card.tsx",
        lineNumber: 6,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_c = Card;
const __TURBOPACK__default__export__ = Card;
var _c;
__turbopack_context__.k.register(_c, "Card");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/auth/LoginPage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Button.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const LoginPage = ({ onLogin, onSwitchToSignUp })=>{
    _s();
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleSubmit = (e)=>{
        e.preventDefault();
        setIsLoading(true);
        // Simulate network request
        setTimeout(()=>{
            setIsLoading(false);
            onLogin();
        }, 800);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full max-w-md px-4 animate-fade-in relative z-10",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-5xl font-bold text-accent-primary mb-2 tracking-tight",
                        children: "Tracker"
                    }, void 0, false, {
                        fileName: "[project]/src/components/auth/LoginPage.tsx",
                        lineNumber: 28,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-text-secondary text-lg",
                        children: "Your daily companion for growth."
                    }, void 0, false, {
                        fileName: "[project]/src/components/auth/LoginPage.tsx",
                        lineNumber: 29,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/auth/LoginPage.tsx",
                lineNumber: 27,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                className: "w-full p-8 shadow-2xl border-border/50 bg-card-bg/80 backdrop-blur-xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold mb-6 text-text-primary",
                        children: "Welcome Back"
                    }, void 0, false, {
                        fileName: "[project]/src/components/auth/LoginPage.tsx",
                        lineNumber: 32,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        className: "space-y-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-text-secondary mb-1.5",
                                        children: "Email"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/auth/LoginPage.tsx",
                                        lineNumber: 35,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "email",
                                        value: email,
                                        onChange: (e)=>setEmail(e.target.value),
                                        className: "w-full p-3 rounded-lg bg-input-bg border border-border text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:outline-none transition-all",
                                        placeholder: "name@example.com",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/auth/LoginPage.tsx",
                                        lineNumber: 36,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/auth/LoginPage.tsx",
                                lineNumber: 34,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-text-secondary mb-1.5",
                                        children: "Password"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/auth/LoginPage.tsx",
                                        lineNumber: 46,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "password",
                                        value: password,
                                        onChange: (e)=>setPassword(e.target.value),
                                        className: "w-full p-3 rounded-lg bg-input-bg border border-border text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:outline-none transition-all",
                                        placeholder: "••••••••",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/auth/LoginPage.tsx",
                                        lineNumber: 47,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/auth/LoginPage.tsx",
                                lineNumber: 45,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                type: "submit",
                                className: "w-full py-3 mt-4 shadow-lg shadow-accent-primary/20",
                                disabled: isLoading,
                                children: isLoading ? 'Logging in...' : 'Log In'
                            }, void 0, false, {
                                fileName: "[project]/src/components/auth/LoginPage.tsx",
                                lineNumber: 56,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/auth/LoginPage.tsx",
                        lineNumber: 33,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-8 text-center text-sm text-text-secondary",
                        children: [
                            "Don't have an account? ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onSwitchToSignUp,
                                className: "text-accent-primary hover:text-accent-primary-dark font-bold hover:underline transition-colors",
                                children: "Sign Up"
                            }, void 0, false, {
                                fileName: "[project]/src/components/auth/LoginPage.tsx",
                                lineNumber: 61,
                                columnNumber: 44
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/auth/LoginPage.tsx",
                        lineNumber: 60,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/auth/LoginPage.tsx",
                lineNumber: 31,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/auth/LoginPage.tsx",
        lineNumber: 26,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(LoginPage, "PAxERxeIeUtBiGMJWuZjcqVn+oM=");
_c = LoginPage;
const __TURBOPACK__default__export__ = LoginPage;
var _c;
__turbopack_context__.k.register(_c, "LoginPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/auth/SignUpPage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Button.tsx [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '../../App'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const SignUpPage = ({ onSignUp, onSwitchToLogin })=>{
    _s();
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { setUserProfile } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(DataContext);
    const handleSubmit = (e)=>{
        e.preventDefault();
        setIsLoading(true);
        // Simulate network request
        setTimeout(()=>{
            setUserProfile((prev)=>({
                    ...prev,
                    name: name,
                    email: email,
                    joinDate: new Date().toISOString()
                }));
            setIsLoading(false);
            onSignUp();
        }, 800);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full max-w-md px-4 animate-fade-in relative z-10",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-5xl font-bold text-accent-primary mb-2 tracking-tight",
                        children: "Tracker"
                    }, void 0, false, {
                        fileName: "[project]/src/components/auth/SignUpPage.tsx",
                        lineNumber: 37,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-text-secondary text-lg",
                        children: "Start your journey today."
                    }, void 0, false, {
                        fileName: "[project]/src/components/auth/SignUpPage.tsx",
                        lineNumber: 38,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/auth/SignUpPage.tsx",
                lineNumber: 36,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                className: "w-full p-8 shadow-2xl border-border/50 bg-card-bg/80 backdrop-blur-xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold mb-6 text-text-primary",
                        children: "Create Account"
                    }, void 0, false, {
                        fileName: "[project]/src/components/auth/SignUpPage.tsx",
                        lineNumber: 41,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        className: "space-y-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-text-secondary mb-1.5",
                                        children: "Full Name"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/auth/SignUpPage.tsx",
                                        lineNumber: 44,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: name,
                                        onChange: (e)=>setName(e.target.value),
                                        className: "w-full p-3 rounded-lg bg-input-bg border border-border text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:outline-none transition-all",
                                        placeholder: "John Doe",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/auth/SignUpPage.tsx",
                                        lineNumber: 45,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/auth/SignUpPage.tsx",
                                lineNumber: 43,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-text-secondary mb-1.5",
                                        children: "Email"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/auth/SignUpPage.tsx",
                                        lineNumber: 55,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "email",
                                        value: email,
                                        onChange: (e)=>setEmail(e.target.value),
                                        className: "w-full p-3 rounded-lg bg-input-bg border border-border text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:outline-none transition-all",
                                        placeholder: "name@example.com",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/auth/SignUpPage.tsx",
                                        lineNumber: 56,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/auth/SignUpPage.tsx",
                                lineNumber: 54,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-text-secondary mb-1.5",
                                        children: "Password"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/auth/SignUpPage.tsx",
                                        lineNumber: 66,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "password",
                                        value: password,
                                        onChange: (e)=>setPassword(e.target.value),
                                        className: "w-full p-3 rounded-lg bg-input-bg border border-border text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:outline-none transition-all",
                                        placeholder: "••••••••",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/auth/SignUpPage.tsx",
                                        lineNumber: 67,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/auth/SignUpPage.tsx",
                                lineNumber: 65,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                type: "submit",
                                className: "w-full py-3 mt-4 shadow-lg shadow-accent-primary/20",
                                disabled: isLoading,
                                children: isLoading ? 'Creating Account...' : 'Sign Up'
                            }, void 0, false, {
                                fileName: "[project]/src/components/auth/SignUpPage.tsx",
                                lineNumber: 76,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/auth/SignUpPage.tsx",
                        lineNumber: 42,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-8 text-center text-sm text-text-secondary",
                        children: [
                            "Already have an account? ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onSwitchToLogin,
                                className: "text-accent-primary hover:text-accent-primary-dark font-bold hover:underline transition-colors",
                                children: "Log In"
                            }, void 0, false, {
                                fileName: "[project]/src/components/auth/SignUpPage.tsx",
                                lineNumber: 81,
                                columnNumber: 46
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/auth/SignUpPage.tsx",
                        lineNumber: 80,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/auth/SignUpPage.tsx",
                lineNumber: 40,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/auth/SignUpPage.tsx",
        lineNumber: 35,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(SignUpPage, "iuOSTvqroEkQLPwh+WQJa3wY0fg=");
_c = SignUpPage;
const __TURBOPACK__default__export__ = SignUpPage;
var _c;
__turbopack_context__.k.register(_c, "SignUpPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_BASE_URL",
    ()=>API_BASE_URL,
    "ENDPOINTS",
    ()=>ENDPOINTS,
    "REQUEST_TIMEOUT_MS",
    ()=>REQUEST_TIMEOUT_MS
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_BASE_URL = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';
const ENDPOINTS = {
    SYNC: '/sync',
    USER_PROFILE: '/user/profile',
    HABITS: '/habits',
    DATA: '/data',
    PLANNER: '/planner',
    GOALS: '/goals',
    EXPENSES: '/expenses',
    QUOTES: '/quotes',
    ACHIEVEMENTS: '/achievements',
    RULES: '/rules'
};
const REQUEST_TIMEOUT_MS = 5000;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "client",
    ()=>client
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/constants.ts [app-client] (ecmascript)");
;
class ApiClient {
    baseURL;
    constructor(baseURL){
        this.baseURL = baseURL;
    }
    async request(endpoint, options = {}) {
        const controller = new AbortController();
        const id = setTimeout(()=>controller.abort(), __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["REQUEST_TIMEOUT_MS"]);
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            signal: controller.signal
        };
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, config);
            clearTimeout(id);
            if (!response.ok) {
                throw new Error(`API call failed: ${response.status} ${response.statusText}`);
            }
            // Handle 204 No Content or empty responses gracefully
            const text = await response.text();
            return text ? JSON.parse(text) : {};
        } catch (error) {
            clearTimeout(id);
            // Re-throw to be handled by service layer
            throw error;
        }
    }
    get(endpoint, headers) {
        return this.request(endpoint, {
            method: 'GET',
            headers
        });
    }
    post(endpoint, data, headers) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            headers
        });
    }
    put(endpoint, data, headers) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers
        });
    }
    delete(endpoint, headers) {
        return this.request(endpoint, {
            method: 'DELETE',
            headers
        });
    }
}
const client = new ApiClient(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_BASE_URL"]);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/services.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchAppData",
    ()=>fetchAppData,
    "syncUserProfile",
    ()=>syncUserProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/constants.ts [app-client] (ecmascript)");
;
;
const fetchAppData = async ()=>{
    try {
        // Simulating a consolidated sync endpoint.
        // In a real scenario, this might be Promise.all() calls to multiple endpoints.
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["client"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENDPOINTS"].SYNC);
        return response;
    } catch (error) {
        console.warn('API unavailable or failed. Falling back to local storage data.', error);
        return null;
    }
};
const syncUserProfile = async (profile)=>{
    try {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["client"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENDPOINTS"].USER_PROFILE, profile);
    } catch (error) {
        console.warn('Failed to sync user profile to server.', error);
        return null;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocalStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useLocalStorage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$dummy_data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/dummy_data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$quotes_data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/quotes_data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$achievements_data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/achievements_data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SettingsModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/SettingsModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$EditHabitsModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/EditHabitsModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$EditRulesModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/EditRulesModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ToolsProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ToolsProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$FloatingTools$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/FloatingTools.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$DraggableResizableModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/DraggableResizableModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$tools$2f$Calculator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/tools/Calculator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$tools$2f$Clock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/tools/Clock.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$tools$2f$ChatTool$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/tools/ChatTool.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$auth$2f$LoginPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/auth/LoginPage.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$auth$2f$SignUpPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/auth/SignUpPage.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/v4.js [app-client] (ecmascript) <export default as v4>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$services$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/services.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/DataContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/SettingsContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const getToday = ()=>new Date().toISOString().split('T')[0];
const DEFAULT_PLANNER_DATA = {
    blocks: [
        {
            id: 'block-1',
            title: 'To-Do',
            x: 200,
            y: 200,
            tasks: [
                {
                    id: 'task-1',
                    text: 'Create a new block',
                    completed: false
                }
            ]
        },
        {
            id: 'block-2',
            title: 'In Progress',
            x: 600,
            y: 350,
            tasks: []
        }
    ],
    links: [],
    transform: {
        scale: 1,
        panX: 0,
        panY: 0
    }
};
const DUMMY_EXPENSES = [
    {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
        date: new Date().toISOString().split('T')[0],
        item: 'Coffee',
        category: 'Food',
        quantity: 1,
        price: 3.50
    },
    {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
        date: new Date().toISOString().split('T')[0],
        item: 'Bus Fare',
        category: 'Transport',
        quantity: 2,
        price: 1.75
    },
    {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        item: 'Groceries',
        category: 'Food',
        quantity: 1,
        price: 75.40
    },
    {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
        date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
        item: 'Movie Tickets',
        category: 'Entertainment',
        quantity: 2,
        price: 15.00
    },
    {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
        date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
        item: 'Electricity Bill',
        category: 'Utilities',
        quantity: 1,
        price: 120.00
    }
];
const DEFAULT_GOALS = {
    daily: [
        {
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
            text: 'Finish the report for Q3',
            status: 'active',
            createdAt: new Date().toISOString(),
            tags: [
                'work'
            ]
        },
        {
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
            text: 'Go for a 30-minute run',
            status: 'completed',
            createdAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            tags: [
                'health'
            ]
        }
    ],
    monthly: [
        {
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
            text: 'Read two books',
            status: 'active',
            createdAt: new Date().toISOString(),
            tags: [
                'personal growth',
                'reading'
            ]
        }
    ],
    future: [
        {
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
            text: 'Plan vacation for next year',
            status: 'active',
            createdAt: new Date().toISOString(),
            tags: [
                'travel',
                'personal'
            ]
        }
    ]
};
const DEFAULT_USER_PROFILE = {
    name: 'Guest User',
    email: 'guest@example.com',
    joinDate: new Date().toISOString(),
    bio: 'Consistent self-improver. Tracking habits one day at a time.',
    location: 'Global',
    skills: [
        'Consistency',
        'Planning',
        'Growth'
    ],
    socials: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com'
    }
};
const translations = {
    en: {
        'home': 'Home',
        'dashboard': 'Dashboard',
        'planner': 'Planner',
        'points': 'Points',
        'journal': 'Journal',
        'expense': 'Expenses',
        'goals': 'Goals',
        'quotes': 'Quotes',
        'achievements': 'Achievements',
        'settings': 'Settings',
        'profile': 'Profile',
        'Theme': 'Theme',
        'Time Format': 'Time Format',
        'Language (UI Only)': 'Language (UI Only)',
        'light': 'light',
        'dark': 'dark',
        '12-Hour': '12-Hour',
        '24-Hour': '24-Hour',
        'English': 'English',
        'Español': 'Español',
        'Français': 'Français',
        'Close': 'Close'
    },
    es: {
        'home': 'Inicio',
        'dashboard': 'Tablero',
        'planner': 'Planificateur',
        'points': 'Puntos',
        'journal': 'Diario',
        'expense': 'Gastos',
        'goals': 'Metas',
        'quotes': 'Citas',
        'achievements': 'Logros',
        'settings': 'Ajustes',
        'profile': 'Perfil',
        'Theme': 'Tema',
        'Time Format': 'Formato de Hora',
        'Language (UI Only)': 'Idioma (Solo UI)',
        'light': 'claro',
        'dark': 'oscuro',
        '12-Hour': '12 horas',
        '24-Hour': '24 horas',
        'English': 'Inglés',
        'Español': 'Español',
        'Français': 'Francés',
        'Close': 'Cerrar'
    },
    fr: {
        'home': 'Accueil',
        'dashboard': 'Tableau de bord',
        'planner': 'Planificateur',
        'points': 'Points',
        'journal': 'Journal',
        'expense': 'Dépenses',
        'goals': 'Objectifs',
        'quotes': 'Citations',
        'achievements': 'Réalisations',
        'settings': 'Paramètres',
        'profile': 'Profil',
        'Theme': 'Thème',
        'Time Format': "Format de l'heure",
        'Language (UI Only)': 'Langue (UI uniquement)',
        'light': 'clair',
        'dark': 'sombre',
        '12-Hour': '12 heures',
        '24-Hour': '24 heures',
        'English': 'Anglais',
        'Español': 'Espagnol',
        'Français': 'Français',
        'Close': 'Fermer'
    }
};
const ToolManager = ()=>{
    _s();
    const { openTools, closeTool, focusTool } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ToolsProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTools"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$FloatingTools$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/components/Providers.tsx",
                lineNumber: 92,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            openTools.map((toolId, index)=>{
                const zIndex = 100 + index;
                switch(toolId){
                    case 'calculator':
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$DraggableResizableModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            title: "Calculator",
                            onClose: ()=>closeTool(toolId),
                            zIndex: zIndex,
                            onFocus: ()=>focusTool(toolId),
                            initialSize: {
                                width: 320,
                                height: 480
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$tools$2f$Calculator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/src/components/Providers.tsx",
                                lineNumber: 106,
                                columnNumber: 33
                            }, ("TURBOPACK compile-time value", void 0))
                        }, toolId, false, {
                            fileName: "[project]/src/components/Providers.tsx",
                            lineNumber: 98,
                            columnNumber: 29
                        }, ("TURBOPACK compile-time value", void 0));
                    case 'clock':
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$DraggableResizableModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            title: "Clock",
                            onClose: ()=>closeTool(toolId),
                            zIndex: zIndex,
                            onFocus: ()=>focusTool(toolId),
                            initialSize: {
                                width: 400,
                                height: 400
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$tools$2f$Clock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/src/components/Providers.tsx",
                                lineNumber: 119,
                                columnNumber: 33
                            }, ("TURBOPACK compile-time value", void 0))
                        }, toolId, false, {
                            fileName: "[project]/src/components/Providers.tsx",
                            lineNumber: 111,
                            columnNumber: 29
                        }, ("TURBOPACK compile-time value", void 0));
                    case 'chat':
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$DraggableResizableModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            title: "AI Assistant",
                            onClose: ()=>closeTool(toolId),
                            zIndex: zIndex,
                            onFocus: ()=>focusTool(toolId),
                            initialSize: {
                                width: 400,
                                height: 600
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$tools$2f$ChatTool$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/src/components/Providers.tsx",
                                lineNumber: 132,
                                columnNumber: 33
                            }, ("TURBOPACK compile-time value", void 0))
                        }, toolId, false, {
                            fileName: "[project]/src/components/Providers.tsx",
                            lineNumber: 124,
                            columnNumber: 29
                        }, ("TURBOPACK compile-time value", void 0));
                    default:
                        return null;
                }
            })
        ]
    }, void 0, true);
};
_s(ToolManager, "9fONw+Ve8lVGMfodr2kXlFdPrvA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ToolsProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTools"]
    ];
});
_c = ToolManager;
function Providers({ children }) {
    _s1();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocalStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('tracker-data', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$dummy_data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DUMMY_DATA"]);
    const [selectedPage, setSelectedPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('home');
    const [habits, setHabits] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocalStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('tracker-habits', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_HABITS"]);
    const [scoringRules, setScoringRules] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocalStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('tracker-rules', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SCORING_RULES"]);
    const [plannerData, setPlannerData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocalStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('tracker-planner', DEFAULT_PLANNER_DATA);
    const [goals, setGoals] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocalStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('tracker-goals', DEFAULT_GOALS);
    const [expenses, setExpenses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocalStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('tracker-expenses', DUMMY_EXPENSES);
    const [quotes, setQuotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocalStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('tracker-quotes', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$quotes_data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DUMMY_QUOTES"]);
    const [achievements, setAchievements] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocalStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('tracker-achievements', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$achievements_data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DUMMY_ACHIEVEMENTS"]);
    const [userProfile, setUserProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocalStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('tracker-user-profile', DEFAULT_USER_PROFILE);
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocalStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('tracker-settings', {
        theme: 'dark',
        timeFormat: '24h',
        language: 'en'
    });
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocalStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('tracker-auth', false);
    const [authView, setAuthView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('login');
    const [isSettingsModalOpen, setIsSettingsModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isEditHabitsModalOpen, setIsEditHabitsModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isEditRulesModalOpen, setIsEditRulesModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const today = getToday();
    const login = ()=>setIsAuthenticated(true);
    const logout = ()=>setIsAuthenticated(false);
    const t = (key)=>{
        return translations[settings.language][key] || key;
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Providers.useEffect": ()=>{
            const root = document.documentElement;
            if (settings.theme === 'light') {
                root.classList.add('light');
                root.classList.remove('dark');
            } else {
                root.classList.remove('light');
                root.classList.add('dark');
            }
        }
    }["Providers.useEffect"], [
        settings.theme
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Providers.useEffect": ()=>{
            const loader = document.getElementById('loader');
            if (loader) {
                setTimeout({
                    "Providers.useEffect": ()=>{
                        loader.style.opacity = '0';
                        setTimeout({
                            "Providers.useEffect": ()=>{
                                loader.style.display = 'none';
                            }
                        }["Providers.useEffect"], 800);
                    }
                }["Providers.useEffect"], 1000);
            }
        }
    }["Providers.useEffect"], []);
    // API Data Sync Effect
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Providers.useEffect": ()=>{
            const syncData = {
                "Providers.useEffect.syncData": async ()=>{
                    if (!isAuthenticated) return;
                    try {
                        console.log('Attempting to sync with remote server...');
                        const apiData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$services$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchAppData"])();
                        if (apiData) {
                            console.log('Remote data found, syncing...', apiData);
                            if (apiData.data) setData(apiData.data);
                            if (apiData.habits) setHabits(apiData.habits);
                            if (apiData.rules) setScoringRules(apiData.rules);
                            if (apiData.planner) setPlannerData(apiData.planner);
                            if (apiData.goals) setGoals(apiData.goals);
                            if (apiData.expenses) setExpenses(apiData.expenses);
                            if (apiData.quotes) setQuotes(apiData.quotes);
                            if (apiData.achievements) setAchievements(apiData.achievements);
                            if (apiData.userProfile) setUserProfile(apiData.userProfile);
                        }
                    } catch (error) {
                        console.warn("API sync failed or unavailable. Using local fallback data.", error);
                    }
                }
            }["Providers.useEffect.syncData"];
            syncData();
        }
    }["Providers.useEffect"], [
        isAuthenticated
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsContext"].Provider, {
        value: {
            settings,
            setSettings,
            isSettingsModalOpen,
            setIsSettingsModalOpen,
            isEditHabitsModalOpen,
            setIsEditHabitsModalOpen,
            isEditRulesModalOpen,
            setIsEditRulesModalOpen,
            scoringRules,
            setScoringRules,
            t
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataContext"].Provider, {
            value: {
                data,
                setData,
                selectedPage,
                setSelectedPage,
                today,
                habits,
                setHabits,
                plannerData,
                setPlannerData,
                goals,
                setGoals,
                expenses,
                setExpenses,
                quotes,
                setQuotes,
                achievements,
                setAchievements,
                userProfile,
                setUserProfile,
                logout
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ToolsProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToolsProvider"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `flex h-screen font-sans text-text-primary bg-background theme-${settings.theme}`,
                    children: !isAuthenticated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full h-full flex items-center justify-center relative overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.03] pointer-events-none"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Providers.tsx",
                                lineNumber: 238,
                                columnNumber: 34
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-primary/10 blur-[100px] rounded-full pointer-events-none"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Providers.tsx",
                                lineNumber: 239,
                                columnNumber: 34
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Providers.tsx",
                                lineNumber: 240,
                                columnNumber: 34
                            }, this),
                            authView === 'login' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$auth$2f$LoginPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                onLogin: login,
                                onSwitchToSignUp: ()=>setAuthView('signup')
                            }, void 0, false, {
                                fileName: "[project]/src/components/Providers.tsx",
                                lineNumber: 243,
                                columnNumber: 37
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$auth$2f$SignUpPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                onSignUp: login,
                                onSwitchToLogin: ()=>setAuthView('login')
                            }, void 0, false, {
                                fileName: "[project]/src/components/Providers.tsx",
                                lineNumber: 245,
                                columnNumber: 37
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Providers.tsx",
                        lineNumber: 237,
                        columnNumber: 29
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                isCollapsed: isSidebarCollapsed,
                                toggleSidebar: ()=>setIsSidebarCollapsed(!isSidebarCollapsed)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Providers.tsx",
                                lineNumber: 250,
                                columnNumber: 33
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `flex-1 h-full overflow-hidden transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'pt-20' : ''}`,
                                children: children
                            }, void 0, false, {
                                fileName: "[project]/src/components/Providers.tsx",
                                lineNumber: 251,
                                columnNumber: 33
                            }, this),
                            isSettingsModalOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SettingsModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/src/components/Providers.tsx",
                                lineNumber: 254,
                                columnNumber: 57
                            }, this),
                            isEditHabitsModalOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$EditHabitsModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                habits: habits,
                                setHabits: setHabits,
                                onClose: ()=>setIsEditHabitsModalOpen(false)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Providers.tsx",
                                lineNumber: 255,
                                columnNumber: 59
                            }, this),
                            isEditRulesModalOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$EditRulesModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                rules: scoringRules,
                                setRules: setScoringRules,
                                onClose: ()=>setIsEditRulesModalOpen(false)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Providers.tsx",
                                lineNumber: 256,
                                columnNumber: 58
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ToolManager, {}, void 0, false, {
                                fileName: "[project]/src/components/Providers.tsx",
                                lineNumber: 257,
                                columnNumber: 33
                            }, this)
                        ]
                    }, void 0, true)
                }, void 0, false, {
                    fileName: "[project]/src/components/Providers.tsx",
                    lineNumber: 235,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Providers.tsx",
                lineNumber: 234,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/Providers.tsx",
            lineNumber: 233,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Providers.tsx",
        lineNumber: 232,
        columnNumber: 9
    }, this);
}
_s1(Providers, "47hM6nGaM7NSkyIqV8O+ogAPbe0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocalStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocalStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocalStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocalStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocalStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocalStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocalStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocalStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocalStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocalStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocalStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    ];
});
_c1 = Providers;
var _c, _c1;
__turbopack_context__.k.register(_c, "ToolManager");
__turbopack_context__.k.register(_c1, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_c7d9f4b2._.js.map