# Implementation Plan: [FEATURE NAME]

**Created**: [DATE]  
**Status**: Draft  
**Branch**: [BRANCH NAME]  
**Feature Spec**: [Link to spec.md]

---

## 1. Technical Context

### 1.1 Technology Stack
[List the technologies being used - keep this section factual and brief]

- Frontend: [Framework/Library]
- Backend: [Framework/Service]
- Database: [Type/Service]
- AI/ML: [Services]
- Deployment: [Platform]
- Other: [Additional services]

### 1.2 Architecture Pattern
[Brief description of the architecture approach]

- [e.g., "Serverless with edge functions"]
- [e.g., "JAMstack with static generation"]
- [e.g., "SPA with API backend"]

### 1.3 Key Integration Points
[List external services and how they integrate]

- [Service 1]: [Purpose and integration method]
- [Service 2]: [Purpose and integration method]

### 1.4 Unknowns & Research Needs
[List any NEEDS CLARIFICATION items that require research]

- [ ] [Unknown 1]
- [ ] [Unknown 2]

---

## 2. Constitution Check

### 2.1 Alignment Verification
[Check against project constitution/conventions]

#### Code Style & Standards
- [ ] Follows project naming conventions
- [ ] Matches established patterns
- [ ] Consistent with existing architecture

#### Security & Privacy
- [ ] Data protection requirements addressed
- [ ] Authentication/authorization planned
- [ ] No security anti-patterns introduced

#### Performance & Scalability
- [ ] Performance requirements feasible
- [ ] Scalability approach defined
- [ ] Resource usage reasonable

#### Testing & Quality
- [ ] Testing strategy defined
- [ ] Quality gates identified
- [ ] Monitoring approach planned

### 2.2 Gate Evaluation
[Evaluate critical decision points]

**Gate 1**: [Gate name]
- Status: PASS / FAIL / CONDITIONAL
- Justification: [Reason]

**Gate 2**: [Gate name]
- Status: PASS / FAIL / CONDITIONAL
- Justification: [Reason]

---

## 3. Phase 0: Research & Decisions

### 3.1 Research Tasks
[For each unknown in section 1.4, document research]

#### Research Task 1: [Topic]
**Question**: [What needs to be researched]  
**Decision**: [What was chosen]  
**Rationale**: [Why this choice]  
**Alternatives Considered**: [What else was evaluated]  
**References**: [Links to docs, articles, examples]

#### Research Task 2: [Topic]
[Repeat structure]

### 3.2 Technology Choices
[Document key technology decisions]

#### Choice 1: [What decision]
- **Selected**: [Chosen option]
- **Rationale**: [Why]
- **Trade-offs**: [What we gain vs. what we give up]

#### Choice 2: [What decision]
[Repeat structure]

### 3.3 Integration Patterns
[Document how external services will be integrated]

#### Integration 1: [Service name]
- **Pattern**: [How it's integrated - e.g., REST API, SDK, Webhook]
- **Authentication**: [How auth is handled]
- **Error Handling**: [Strategy for failures]
- **Rate Limits**: [Known limits and handling]

---

## 4. Phase 1: Design Artifacts

### 4.1 Data Model
[Reference to data-model.md - brief summary here]

**Key Entities**:
- [Entity 1]: [Brief description]
- [Entity 2]: [Brief description]

**Critical Relationships**:
- [Relationship 1]
- [Relationship 2]

**Full details**: See [data-model.md](./data-model.md)

### 4.2 API Contracts
[Reference to contracts/ directory - brief summary here]

**Endpoints Overview**:
- `[METHOD] /path`: [Purpose]
- `[METHOD] /path`: [Purpose]

**Full details**: See [contracts/](./contracts/) directory

### 4.3 Component Architecture
[High-level component breakdown]

#### Frontend Components
- **[Component Category 1]**: [Components in this category]
- **[Component Category 2]**: [Components in this category]

#### Backend Components
- **[Component Category 1]**: [Components in this category]
- **[Component Category 2]**: [Components in this category]

### 4.4 State Management
[How application state is managed]

- **Client State**: [Approach - e.g., React Context, Zustand]
- **Server State**: [Approach - e.g., SWR, React Query]
- **Persistent State**: [Approach - e.g., Database, Local Storage]

### 4.5 Authentication & Authorization
[Security implementation approach]

- **Authentication Method**: [e.g., JWT, OAuth, Supabase Auth]
- **Session Management**: [How sessions work]
- **Authorization Pattern**: [RBAC, ABAC, etc.]
- **Guest/Trial Logic**: [How temporary access works]

---

## 5. Phase 2: Implementation Strategy

### 5.1 Development Phases
[Break implementation into logical phases]

#### Phase 1: [Phase Name]
**Goal**: [What this phase achieves]  
**Duration Estimate**: [Time estimate]

**Tasks**:
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

**Deliverables**:
- [Deliverable 1]
- [Deliverable 2]

**Success Criteria**:
- [How we know this phase is complete]

#### Phase 2: [Phase Name]
[Repeat structure]

### 5.2 Critical Path
[Identify dependencies and must-do-first items]

**Must Complete First**:
1. [Foundational task 1]
2. [Foundational task 2]

**Parallel Workstreams**:
- Stream A: [Tasks that can be done together]
- Stream B: [Tasks that can be done together]

**Integration Points**:
- [When/where components come together]

### 5.3 Risk Mitigation
[Identify risks and mitigation strategies]

**Risk 1**: [Description]
- **Impact**: High / Medium / Low
- **Probability**: High / Medium / Low
- **Mitigation**: [How to reduce/handle]

**Risk 2**: [Description]
[Repeat structure]

### 5.4 Testing Strategy
[How features will be tested]

#### Unit Testing
- **Scope**: [What gets unit tests]
- **Tools**: [Testing framework]
- **Coverage Target**: [e.g., 80%]

#### Integration Testing
- **Scope**: [What gets integration tests]
- **Approach**: [How integration is tested]

#### End-to-End Testing
- **Scope**: [Critical user flows]
- **Tools**: [E2E framework]

#### Manual Testing
- **Scope**: [What requires manual QA]
- **Test Cases**: [Link to test plan]

---

## 6. Phase 3: Deployment & Operations

### 6.1 Deployment Strategy
[How the feature gets deployed]

- **Environment Progression**: [Dev → Staging → Production]
- **Deployment Method**: [CI/CD, manual, etc.]
- **Rollout Strategy**: [All at once, gradual, feature flag]
- **Rollback Plan**: [How to revert if needed]

### 6.2 Monitoring & Observability
[How to monitor the feature in production]

- **Key Metrics**: [What to track]
- **Alerts**: [What triggers notifications]
- **Logging**: [What gets logged]
- **Dashboards**: [What to visualize]

### 6.3 Documentation
[Documentation deliverables]

- [ ] User-facing documentation
- [ ] API documentation
- [ ] Developer guide
- [ ] Deployment runbook
- [ ] Troubleshooting guide

---

## 7. Open Issues & Decisions

### 7.1 Unresolved Questions
[Track questions that came up during planning]

**Question 1**: [What's unclear]
- **Impact**: [Why it matters]
- **Owner**: [Who's investigating]
- **Target Resolution**: [When to decide]

### 7.2 Deferred Decisions
[Decisions consciously postponed]

**Decision 1**: [What's being deferred]
- **Rationale**: [Why deferring is OK]
- **Revisit Trigger**: [When to reconsider]

---

## 8. Success Validation

### 8.1 Pre-Launch Checklist
- [ ] All functional requirements implemented
- [ ] All acceptance criteria met
- [ ] Tests passing (unit, integration, E2E)
- [ ] Security review completed
- [ ] Performance benchmarks met
- [ ] Documentation complete
- [ ] Deployment runbook tested

### 8.2 Post-Launch Validation
[How to verify success in production]

- **Week 1**: [What to check]
- **Week 2-4**: [What to monitor]
- **Month 2-3**: [Success criteria validation]

### 8.3 Iteration Plan
[How to improve after launch]

- **Feedback Collection**: [How/where]
- **Iteration Cadence**: [When to update]
- **Success Metrics Review**: [When to evaluate]

---

## 9. Appendix

### 9.1 References
- Feature Spec: [Link]
- Research Documents: [Links]
- Related Features: [Links]
- External Documentation: [Links]

### 9.2 Glossary
[Define domain-specific terms]

- **[Term 1]**: [Definition]
- **[Term 2]**: [Definition]

---

## Notes

- This plan is a living document and should be updated as implementation progresses
- All design decisions should reference this plan
- Deviations from this plan should be documented with justification
