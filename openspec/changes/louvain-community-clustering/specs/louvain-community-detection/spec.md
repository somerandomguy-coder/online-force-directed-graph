## ADDED Requirements

### Requirement: Community Detection Algorithm
The system SHALL use the Louvain algorithm to detect communities (clusters) within the graph based on node connections and link weights.

#### Scenario: Clustering a linked graph
- **WHEN** the NLP worker finishes generating the co-occurrence graph
- **THEN** it applies the Louvain algorithm to assign a `cluster` ID to each node.

### Requirement: Deterministic Cluster Mapping
The system SHALL maintain a consistent mapping of cluster IDs to nodes unless the graph structure changes significantly, ensuring visual stability.

#### Scenario: Re-processing same text
- **WHEN** the user re-processes the same text without changes
- **THEN** nodes are assigned to the same cluster IDs as before.
