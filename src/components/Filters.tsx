import { Button, FormControl, Select, FilledInput, InputLabel, Box, MenuItem } from "@mui/material"
import { FC, useEffect, useRef, useState } from "react"
import "./Filters.css"
import { useSearchParams } from "react-router-dom"
import { FiltersValues } from "../models/filterValues"
import { getFilterOptions } from "../helpers/filterOptionsHelper"
import { Options, optionObject } from "../models/options"
import { Menu } from "@mui/icons-material"

interface Props {
    onClose: () => void
}

export const Filters: FC<Props> = ({ onClose }) => {
    const [disablingButton, setDisablingButton] = useState(true)
    const [organismOptions, setOrganismOptions] = useState<optionObject[]>([])
    const [annotationOptions, setAnnotationOptions] = useState<optionObject[]>([])
    const [withOptions, setWithOptions] = useState<optionObject[]>([])
    const geneRef = useRef<HTMLInputElement>(null);
    const organismRef = useRef<HTMLSelectElement>(null);
    const fromRef = useRef<HTMLInputElement>(null);
    const toRef = useRef<HTMLInputElement>(null);
    const annotationRef = useRef<HTMLSelectElement>(null);
    const withRef = useRef<HTMLSelectElement>(null);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.has("filters")) {
            const currentFilters: FiltersValues = JSON.parse(decodeURI(searchParams.get("filters")!))
            geneRef.current!.value = currentFilters.gene ?? "";
            if (currentFilters.organism) {
                for (let option of organismRef.current!.options) {
                    option.selected = currentFilters.organism.includes(option.value);
                }
            }
            fromRef.current!.value = currentFilters.from ? currentFilters.from.toString() : "";
            toRef.current!.value = currentFilters.to ? currentFilters.to.toString() : "";
            if (currentFilters.annotation) {
                for (let option of annotationRef.current!.options) {
                    option.selected = currentFilters.annotation.includes(option.value);
                }
            }
            //annotationRef.current!.value = currentFilters.annotation ?? [];
            if (currentFilters.with) {
                for (let option of withRef.current!.options) {
                    option.selected = currentFilters.with.includes(option.value);
                }
            }
            //withRef.current!.value = currentFilters.with ?? [];
        }
    }, [])

    const searchQuery = decodeURI(searchParams.get("query") ?? "*") as string;

    useEffect(() => {
        async function fetch() {
            const options: Options = await getFilterOptions(searchQuery);
            setOrganismOptions(options.organisms);
            setAnnotationOptions(options.annotations);
            setWithOptions(options.with);
        }
        fetch();
    }, [searchQuery])

    function handleInput() {
        setDisablingButton(!(
            !!geneRef.current?.value
            || !!organismRef.current?.value
            || !!fromRef.current?.value
            || !!toRef.current?.value
            || !!annotationRef.current?.value
            || !!withRef.current?.value
        )
        );
    }

    function handleCancel() {
        onClose()
    }

    function handleApplyFilters() {
        setSearchParams(searchParams => {
            const hasFilters = !!geneRef.current?.value
                || !!organismRef.current?.value
                || !!fromRef.current?.value
                || !!toRef.current?.value
                || !!annotationRef.current?.value
                || !!withRef.current?.value;

            if (hasFilters) {
                const filterValues: FiltersValues = {
                    gene: geneRef.current?.value ? geneRef.current?.value : undefined,
                    organism: organismRef.current && organismRef.current.selectedOptions.length > 0
                        ? Array.from(organismRef.current.selectedOptions).map(o => o.value)
                        : undefined,
                    from: fromRef.current?.value ? parseInt(fromRef.current.value) : undefined,
                    to: toRef.current?.value ? parseInt(toRef.current.value) : undefined,
                    annotation: annotationRef.current && annotationRef.current.selectedOptions.length > 0
                        ? Array.from(annotationRef.current.selectedOptions).map(o => o.value)
                        : undefined,
                    with: withRef.current && withRef.current.selectedOptions.length > 0
                        ? Array.from(withRef.current.selectedOptions).map(o => o.value)
                        : undefined,
                }
                console.log(filterValues);
                searchParams.set("filters", encodeURI(JSON.stringify(filterValues)));
            } else {
                searchParams.delete("filters");
            }
            return searchParams;
        })

        onClose()
    }

    return (
        <div className="filtersContainer">
            <h3 className="filtersHeader">Filters</h3>
            <h4 className="filterHeader">Gene Name</h4>
            <FormControl
                onInput={handleInput}
                onChange={() => { setDisablingButton(false) }}
                sx={{ width: '90%', marginBottom: "15px", fontFamily: "Open Sans" }} variant="filled"
            >
                <InputLabel htmlFor="gene-input">Enter gene name</InputLabel>
                <FilledInput
                    inputRef={geneRef}
                    id="gene-input"
                    type={'text'}
                    sx={{ height: "52px" }}
                />
            </FormControl>
            <h4 className="filterHeader">Organism</h4>
            <FormControl
                onInput={handleInput}
                onChange={() => { setDisablingButton(false) }}
                sx={{ width: '90%', marginBottom: "15px", fontFamily: "Open Sans" }} variant="filled"
            >
                <InputLabel htmlFor="organism-input">Select options</InputLabel>
                <Select
                    inputRef={organismRef}
                    id="organism-input"
                    sx={{ height: "52px" }}
                    onChange={() => { setDisablingButton(false) }}
                    defaultValue={[]}
                    multiple
                >
                    {organismOptions.map((option) => (<MenuItem value={option.value}>{option.label} ({option.count})</MenuItem>))}
                </Select>
            </FormControl>
            <h4 className="filterHeader">Sequence length</h4>
            <Box component="form" noValidate sx={{ width: "90%", marginLeft: "5%", display: "flex", alignItems: "center" }}>
                <FormControl
                    onInput={handleInput}
                    onChange={() => { setDisablingButton(false) }}
                    sx={{ width: '40%', marginBottom: '15px', fontFamily: 'Open Sans' }}
                    variant="filled"
                >
                    <InputLabel htmlFor="from-input">From</InputLabel>
                    <FilledInput
                        inputRef={fromRef}
                        id="from-input"
                        type={'number'}
                        sx={{ width: '100%', height: "52px", display: 'inline-block' }}
                    />
                </FormControl>
                <hr className="rangeLine" />
                <FormControl
                    onInput={handleInput}
                    onChange={() => { setDisablingButton(false) }}
                    sx={{ width: '40%', marginBottom: '20px', fontFamily: 'Open Sans' }}
                    variant="filled"
                >
                    <InputLabel htmlFor="to-input">To</InputLabel>
                    <FilledInput
                        inputRef={toRef}
                        id="to-input"
                        type={'number'}
                        sx={{ width: '100%', height: "52px", display: 'inline-block' }}
                    />
                </FormControl>
            </Box>
            <h4 className="filterHeader">Annotation score</h4>
            <FormControl
                onInput={handleInput}
                onChange={() => { setDisablingButton(false) }}
                sx={{ width: '90%', marginBottom: "15px", fontFamily: "Open Sans" }}
                variant="filled"
            >
                <InputLabel htmlFor="annotation-input">Select options</InputLabel>
                <Select
                    inputRef={annotationRef}
                    id="annotation-input"
                    sx={{ height: "52px" }}
                    onChange={() => { setDisablingButton(false) }}
                    multiple
                    defaultValue={[]}
                >
                    {annotationOptions.map((option) => (<MenuItem value={option.value}>{option.label} ({option.count})</MenuItem>))}
                </Select>
            </FormControl>
            <h4 className="filterHeader">Protein with</h4>
            <FormControl
                onInput={handleInput}
                sx={{ width: '90%', marginBottom: "15px", fontFamily: "Open Sans" }}
                variant="filled"
                onChange={() => { setDisablingButton(false) }}
            >
                <InputLabel htmlFor="protein-with-input">Select</InputLabel>
                <Select
                    inputRef={withRef}
                    id="protein-with-input"
                    sx={{ height: "52px" }}
                    onChange={() => { setDisablingButton(false) }}
                    multiple
                    defaultValue={[]}
                >
                    {withOptions.map((option) => (<MenuItem value={option.value}>{option.label} ({option.count})</MenuItem>))}
                </Select>
            </FormControl>
            <div className="buttonsContainer">
                <Button
                    onClick={handleCancel}
                    variant="text"
                    sx={{
                        width: "42%",
                        borderRadius: "12px",
                        fontWeight: 600,
                        fontFamily: "Open Sans",
                        fontSize: "14px",
                        lineHeight: "19px",
                        textTransform: "false",
                        padding: "10px 30px 10px 30px"
                    }}

                >Cancel</Button>
                <Button
                    onClick={handleApplyFilters}
                    variant="contained"
                    disabled={disablingButton}
                    sx={{
                        width: "42%",
                        borderRadius: "12px",
                        fontWeight: 600,
                        fontFamily: "Open Sans",
                        fontSize: "14px",
                        lineHeight: "19px",
                        textTransform: "false",
                        padding: "10px 15px 10px 15px"
                    }}
                >Apply Filters</Button>
            </div>
        </div >
    )
}