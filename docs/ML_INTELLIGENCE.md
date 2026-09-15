# Chaos Tracker — ML & Intelligence Documentation

## Overview

This document covers Phase 9 (ML & Prediction) and Phase 10 (Personal Intelligence Engine) of the Chaos Tracker roadmap.

## Phase 9 — ML & Prediction (`/api/v1/ml/`)

### P9-01 — ML Data Pipeline
- **Endpoint**: `GET/POST /api/v1/ml/datasets/` , `GET/PUT/DELETE /api/v1/ml/datasets/<id>/`
- Manages training datasets for ML models. Tracks data type, split (train/validation/test), record count, and features.

### P9-02 — Feature Engineering
- **Endpoint**: `GET/POST /api/v1/ml/features/` , `GET/PUT/DELETE /api/v1/ml/features/<id>/`
- Defines behavioral features derived from tracker data. Supports numerical, categorical, boolean, temporal, and aggregate feature types.

### P9-03 — Data Quality Checks
- **Endpoint**: `GET/POST /api/v1/ml/quality/` , `GET/PUT/DELETE /api/v1/ml/quality/<id>/`
- Runs quality checks (completeness, uniqueness, validity, consistency, freshness, outliers) on training data.

### P9-04 — Transaction Categorization
- **Endpoint**: `GET/POST /api/v1/ml/transaction-category/` , `GET/PUT/DELETE /api/v1/ml/transaction-category/<id>/`
- Predicts expense categories using ML model. Includes confidence score and alternative categories.

### P9-05 — Spending Prediction
- **Endpoint**: `GET/POST /api/v1/ml/spending-prediction/` , `GET/PUT/DELETE /api/v1/ml/spending-prediction/<id>/`
- Forecasts future spending by category for weekly/monthly/quarterly periods with confidence intervals.

### P9-06 — Habit Consistency Prediction
- **Endpoint**: `GET/POST /api/v1/ml/habit-consistency/` , `GET/PUT/DELETE /api/v1/ml/habit-consistency/<id>/`
- Predicts likelihood of missing a habit on a given date with contributing factors.

### P9-07 — Goal Completion Prediction
- **Endpoint**: `GET/POST /api/v1/ml/goal-completion/` , `GET/PUT/DELETE /api/v1/ml/goal-completion/<id>/`
- Estimates goal completion probability and predicted completion date.

### P9-08 — Anomaly Detection
- **Endpoint**: `GET/POST /api/v1/ml/anomaly/` , `GET/PUT/DELETE /api/v1/ml/anomaly/<id>/`
- Detects unusual activity across spending, habits, goals, and activity domains.

### P9-09 — Recommendation Model
- **Endpoint**: `GET/POST /api/v1/ml/recommendation-score/` , `GET/PUT/DELETE /api/v1/ml/recommendation-score/<id>/`
- Ranks recommendations across expense, habit, goal, productivity, and finance domains.

### P9-10 — Model Evaluation
- **Endpoint**: `GET/POST /api/v1/ml/evaluation/` , `GET/PUT/DELETE /api/v1/ml/evaluation/<id>/`
- Records evaluation metrics (accuracy, precision, recall, F1, AUC-ROC, RMSE, MAE, R²).

### P9-11 — Model Versioning
- **Endpoint**: `GET/POST /api/v1/ml/model-version/` , `GET/PUT/DELETE /api/v1/ml/model-version/<id>/`
- Tracks model versions, hyperparameters, features used, and performance metrics.

### P9-12 — Model Monitoring
- **Endpoint**: `GET/POST /api/v1/ml/monitoring/` , `GET/PUT/DELETE /api/v1/ml/monitoring/<id>/`
- Monitors data drift, concept drift, and performance degradation with alert levels.

## Phase 10 — Personal Intelligence Engine (`/api/v1/intelligence/`)

### P10-01 — Unified Personal State
- **Endpoint**: `GET/PUT /api/v1/intelligence/state/`
- Represents the current user state across all tracker domains with aggregate scores.

### P10-02 — Cross-domain Reasoning
- **Endpoint**: `GET/POST /api/v1/intelligence/reasoning/` , `GET/PUT/DELETE /api/v1/intelligence/reasoning/<id>/`
- Performs correlation, causal, pattern, trend, and comparison analysis across tracker domains.

### P10-03 — Recommendation Engine
- **Endpoint**: `GET/POST /api/v1/intelligence/recommendation/` , `GET/PUT/DELETE /api/v1/intelligence/recommendation/<id>/`
- Generates ranked recommendations across habits, goals, expenses, productivity, finance, and wellness.

### P10-04 — Opportunity Detection
- **Endpoint**: `GET/POST /api/v1/intelligence/opportunity/` , `GET/PUT/DELETE /api/v1/intelligence/opportunity/<id>/`
- Identifies improvement opportunities with severity levels and suggested actions.

### P10-05 — Risk Detection
- **Endpoint**: `GET/POST /api/v1/intelligence/risk/` , `GET/PUT/DELETE /api/v1/intelligence/risk/<id>/`
- Detects potential negative trends (habit decline, goal stall, overspending, productivity drop).

### P10-06/07/08 — Intervention Engines
- **Endpoint**: `GET/POST /api/v1/intelligence/intervention/` , `GET/PUT/DELETE /api/v1/intelligence/intervention/<id>/`
- Generic intervention model supporting goal, financial, and productivity interventions with status tracking.

### P10-09 — Personalized Daily Plan
- **Endpoint**: `GET/POST /api/v1/intelligence/daily-plan/` , `GET/PUT/DELETE /api/v1/intelligence/daily-plan/<id>/`
- Generates adaptive daily plans with priority levels and confidence scores.

### P10-10 — Weekly Strategy Generation
- **Endpoint**: `GET/POST /api/v1/intelligence/weekly-strategy/` , `GET/PUT/DELETE /api/v1/intelligence/weekly-strategy/<id>/`
- Suggests next week's priorities, focus areas, key goals, and risk mitigations.

### P10-11 — Explainable Recommendations
- **Endpoint**: `GET/POST /api/v1/intelligence/explanation/` , `GET/PUT/DELETE /api/v1/intelligence/explanation/<id>/`
- Provides step-by-step reasoning and supporting data for recommendations, predictions, and insights.

### P10-12 — Feedback Loop
- **Endpoint**: `GET/POST /api/v1/intelligence/feedback/` , `GET/PUT/DELETE /api/v1/intelligence/feedback/<id>/`
- Captures user acceptance/rejection of recommendations and interventions to improve future predictions.

## Pipeline Endpoints

- `POST /api/v1/ml/pipeline/run/` — Trigger full ML pipeline execution
- `POST /api/v1/intelligence/run/` — Trigger intelligence engine execution
