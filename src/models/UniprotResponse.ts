export interface UniprotResponse {
    data: UniprotProtein[],
    totalResults: number,
    link: string | null
}

export interface UniprotProtein {
    entryType: string;
    primaryAccession: string;
    secondaryAccessions: string[];
    uniProtkbId: string;
    sequence: Sequence;
    entryAudit: EntryAudit;
    annotationScore: number;
    organism: Organism;
    proteinExistence: string;
    proteinDescription: ProteinDescription;
    genes?: Gene[];
    comments?: Comment[];
    features: Feature[];
}

interface EntryAudit {
    firstPublicDate: string;
    lastAnnotationUpdateDate: string;
    lastSequenceUpdateDate: string;
    entryVersion: number;
    sequenceVersion: number;
}

interface Organism {
    scientificName: string;
    commonName: string;
    taxonId: number;
    lineage: string[];
}

interface ProteinDescription {
    recommendedName: Name;
    alternativeNames: Name[];
}

interface Name {
    fullName: EvidenceValue;
}

interface Gene {
    geneName: EvidenceValue;
    synonyms?: EvidenceValue[];
    orderedLocusNames: Value[];
    orfNames: Value[];
}

export interface Comment {
    texts?: Text[];
    commentType: string;
    subcellularLocations?: SubcellularLocation[];
}

interface Text {
    evidences: Evidence[];
    value: string;
}

interface SubcellularLocation {
    location: EvidenceValue;
    topology?: EvidenceValue;
    id: string;
}

interface Feature {
    type: string;
    location: Location;
    description: string;
    featureId?: string;
    evidences?: Evidence[];
}

export interface EvidenceValue {
    evidences: Evidence[];
    value: string;
}

interface Value {
    value: string;
}

interface Evidence {
    evidenceCode: string;
    source: string;
    id: string;
}

interface Location {
    start: ModifierValue;
    end: ModifierValue;
}

interface ModifierValue {
    value: number;
    modifier: string;
}

interface Sequence {
    value?: string;
    length: number;
    molWeight?: number;
    crc64?: string;
    md5?: string;
}

