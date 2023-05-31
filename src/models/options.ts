export interface Options {
    organisms: optionObject[],
    annotations: optionObject[],
    with: optionObject[]
}

export interface optionObject {
    value: string,
    label: string,
    count: number, 
}