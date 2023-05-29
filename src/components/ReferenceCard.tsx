import { FC } from "react";
import { Reference } from "../models/reference";
import "./ReferenceCard.css";
import { RefButton } from "./RefButton";

interface Props {
    item: Reference,
}
export const ReferenceCard: FC<Props> = ({item}) => {
    return (
        <div className="cardContainer">
            <h3 className="cartTitle">{item.title}</h3>
            <div className="authorsContainer">{item.authors}</div>
            <p>
                <span className="featureHeader">Cited for: </span>
                {item.citedFor}
            </p>
            <p>
                <span className="featureHeader">Source: </span>
                {item.source}
            </p>
            <div className="buttonsContainer">
                <RefButton link={item.pubMed ?? ""} title="PubMed" />
                <RefButton link={item.europePMC ?? ""} title="Europe PMC" />
                <RefButton link={item.doi.link ?? ""} title={`${item.journal} ${item.volume}:${item.firstPage}-${item.lastPage} (${item.publicationDate})`} />
            </div>
        </div>
    )
}