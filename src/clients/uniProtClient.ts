import { Protein } from "../models/protein";

const UniProtUrl="https://rest.uniprot.org/uniprotkb/search"

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
        .find((comment:any) => comment.commentType==='SUBCELLULAR LOCATION')?.subcellularLocations
        .map((obj: any) => obj.location.value)
    return cellularLocation ?? []
}

export async function searchProteins(query:string): Promise<Protein[]> {
    const response = await fetch(`${UniProtUrl}?query=${query}`);
    const data = (await response.json()).results;
    return data.map((result: any) =>({
        entry: result.primaryAccession, 
        entryNames: result.uniProtkbId,
        genes: extractGenes(result),
        organism: result.organism.scientificName,
        subcellularLocation: extractCellularLocation(result)??[],
        length: result.features.find((feature: any) => feature.type==='Chain').location.end.value as number, 
        }))
}