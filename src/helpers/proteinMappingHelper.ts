import { Protein, ProteinInfo } from "../models/protein"
import { getProteinInfo, searchProteins } from "../clients/uniProtClient"
import { Reference } from "../models/reference"

function extractGenes(resultJson: any) {
    const gene = resultJson.genes[0]
    if (gene.synonyms) {
        const polyNames = [gene.geneName.value, ...gene.synonyms.map((synonym: any) => synonym.value)].flat()
        return polyNames
    } else {
        return [gene.geneName.value]
    }
}

function extractCellularLocation(resultJson: any) {
    const cellularLocation = resultJson.comments
        .find((comment: any) => comment.commentType === 'SUBCELLULAR LOCATION')?.subcellularLocations
        .map((obj: any) => obj.location.value)
    return cellularLocation ?? []
}

function createReferencesList(references: any[]): Reference[] {
    return references.map((reference: any) => ({
        id: reference.citation.id,
        authors: ((reference.citation.authors)
            ? ((reference.citation.authors.length > 1)
                ? reference.citation.authors.join(', ')
                : reference.citation.authors[0])
            : "unknown"),
        title: reference.citation.title,
        citedFor: ((reference.referencePositions)
            ? ((reference.referencePositions.length > 1)
                ? reference.referencePositions.join(', ')
                : reference.referencePositions[0])
            : []),
    }))
}

export async function createPolymersObject(searchQuery: string): Promise<Protein[]> {
    const data = await searchProteins(searchQuery);
    return data.map((result: any) => ({
        entry: result.primaryAccession,
        entryNames: result.uniProtkbId,
        genes: extractGenes(result),
        organism: result.organism.scientificName,
        subcellularLocation: extractCellularLocation(result) ?? [],
        length: result.features.find((feature: any) => feature.type === 'Chain').location.end.value as number,
    }))
}

export async function createPolymerInfoObject(polymerEntry: string): Promise<ProteinInfo> {
    const data = await getProteinInfo(polymerEntry);
    return {
        entry: data.primaryAccession,
        entryNames: data.uniProtkbId,
        organism: data.organism.scientificName,
        lastUpdated: data.entryAudit.lastSequenceUpdateDate,
        proteinDescription: data.proteinDescription.recommendedName.fullName.value,
        gene: data.genes[0].geneName.value,
        references: createReferencesList(data.references),
        mass: data.sequence.molWeight,
        length: data.sequence.length,
        checksum: data.sequence.crc64,
        sequence: data.sequence.value
    }
}