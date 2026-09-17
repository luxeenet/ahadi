"use strict";
// ============================================================
// Trust DNA Types
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRUST_SCORE_VERSIONS = void 0;
// Score algorithm versions — historical results remain explainable
exports.TRUST_SCORE_VERSIONS = {
    v1: {
        weights: {
            reliability: 0.30,
            completion: 0.25,
            timeliness: 0.25,
            communication: 0.10,
            verified: 0.10,
        },
    },
};
//# sourceMappingURL=trust.types.js.map