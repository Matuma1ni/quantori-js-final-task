import { Button, FormControl, Select, FilledInput, InputLabel, Box } from "@mui/material"
import { FC, useEffect, useMemo, useRef, useState } from "react"
import "./Filters.css"
import { useSearchParams } from "react-router-dom"
import { FiltersValues } from "../models/filterValues"

interface Props {
    onClose: () => void
}

export const Filters: FC<Props> = ({ onClose }) => {
    const [disablingButton, setDisablingButton] = useState(true)
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
            organismRef.current!.value = currentFilters.organism ?? "";
            fromRef.current!.value = currentFilters.from ? currentFilters.from.toString() : "";
            toRef.current!.value = currentFilters.to ? currentFilters.to.toString() : "";
            annotationRef.current!.value = currentFilters.annotation ?? "";
            withRef.current!.value = currentFilters.with ?? "";
        }
    }, [])

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
                    organism: organismRef.current?.value ? organismRef.current?.value : undefined,
                    from: fromRef.current?.value ? parseInt(fromRef.current.value) : undefined,
                    to: toRef.current?.value ? parseInt(toRef.current.value) : undefined,
                    annotation: annotationRef.current?.value ? annotationRef.current?.value : undefined,
                    with: withRef.current?.value ? withRef.current?.value : undefined
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
                <InputLabel htmlFor="organism-input">Select an option</InputLabel>
                <Select
                    inputRef={organismRef}
                    id="organism-input"
                    sx={{ height: "52px" }}
                />
                { }
            </FormControl>
            <h4 className="filterHeader">Sequence length</h4>
            <Box component="form" noValidate sx={{ width: "90%", marginLeft: "5%", display: "flex", alignItems: "center" }}>
                <FormControl
                    onInput={handleInput}
                    onChange={() => {setDisablingButton(false)}}
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
                    onChange={() => {setDisablingButton(false)}}
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
                onChange={() => {setDisablingButton(false)}}
                sx={{ width: '90%', marginBottom: "15px", fontFamily: "Open Sans" }} 
                variant="filled"
            >
                <InputLabel htmlFor="annotation-input">Select an option</InputLabel>
                <Select
                    inputRef={annotationRef}
                    id="annotation-input"
                    sx={{ height: "52px" }}
                />
                { }
            </FormControl>
            <h4 className="filterHeader">Protein with</h4>
            <FormControl 
                onInput={handleInput} 
                sx={{ width: '90%', marginBottom: "15px", fontFamily: "Open Sans" }} 
                variant="filled"
                onChange={() => {setDisablingButton(false)}}
            >
                <InputLabel htmlFor="protein-with-input">Select</InputLabel>
                <Select
                    inputRef={withRef}
                    id="protein-with-input"
                    sx={{ height: "52px" }}
                />
                { }
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