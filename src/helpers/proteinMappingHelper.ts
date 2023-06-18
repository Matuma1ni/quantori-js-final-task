import { Protein, ProteinInfo } from "../models/Protein"
import { getNextProteins, getProteinInfo, searchProteins } from "../clients/uniProtClient"
import { Reference, Doi } from "../models/Reference"

function extractGenes(resultJson: any) {
    const gene = resultJson.genes ? resultJson.genes[0] : "";
    if (gene.synonyms) {
        const polyNames = [gene.geneName.value, ...gene.synonyms.map((synonym: any) => synonym.value)].flat()
        return polyNames
    } else {
        return [gene.geneName?.value]
    }
}

function extractCellularLocation(resultJson: any) {
    const cellularLocation = resultJson.comments?.
        find((comment: any) => comment.commentType === 'SUBCELLULAR LOCATION')?.subcellularLocations
        .map((obj: any) => obj.location.value)
    return cellularLocation ?? []
}

function createPubMedLink(pubMedID: string): { pubMed: string | null, europePMC: string | null } {
    if (pubMedID) {
        return {
            pubMed: `https://pubmed.ncbi.nlm.nih.gov/${pubMedID}/`,
            europePMC: `https://europepmc.org/article/MED/${pubMedID}`
        };
    } else {
        return {
            pubMed: null,
            europePMC: null
        };
    }
}
function createDoi(citations: any): Doi {
    function findDoi(citations: any): string | null {
        if (citations?.find((citation: any) => citation.database === "DOI")) {
            return `https://doi.org/${citations.find((citation: any) => citation.database === "DOI").id}`;
        } else {
            return null;
        }
    }
    return {
        link: findDoi(citations),
    }
}

function createReferencesList(references: any[], source: string): Reference[] {
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
        source: source,
        ...createPubMedLink(reference.citation.citationCrossReferences
            ?.find((citationCR: any) => citationCR.database === "PubMed")?.id),
        doi: createDoi(reference.citation.citationCrossReferences),
        journal: reference.citation.journal ?? "",
        volume: reference.citation.volume ?? "",
        firstPage: reference.citation.firstPage ?? "",
        lastPage: reference.citation.lastPage ?? "",
        publicationDate: reference.citation.publicationDate ?? "",
    }));
}

export async function createPolymersObject(searchQuery: string, filtersValues: any, sortField: string, sortDirection: string|null): Promise<{ proteins: Protein[], totalNumber: number, nextURL: string | null }> {
    let filters = "";
    let sortQuery = null;
    if (filtersValues) {
        filters = Object
            .keys(filtersValues)
            .map((filterFeature) => (`(${filterFeature}:${filtersValues[filterFeature]})`))
            .join(" AND ")
    }
    sortQuery = (sortField) 
        ? `${sortField} ${sortDirection}` 
        : null;
    console.log("sort:", sortQuery);
    const promise = searchQuery.startsWith("http")
        ? getNextProteins(searchQuery)
        : searchProteins(searchQuery, filters, sortQuery);
    const { data, totalResults, link } = await promise;
    return {
        proteins: data.map((result: any) => ({
            accession: result.primaryAccession,
            id: result.uniProtkbId,
            gene: extractGenes(result),
            organism_name: result.organism.scientificName,
            subcellularLocation: extractCellularLocation(result).join(', ') ?? "",
            length: result.sequence.length
        })),
        totalNumber: totalResults,
        nextURL: link,
    }
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
        references: createReferencesList(data.references, data.entryType),
        mass: data.sequence.molWeight,
        length: data.sequence.length,
        checksum: data.sequence.crc64,
        sequence: data.sequence.value
    }
}