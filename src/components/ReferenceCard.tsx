import { FC } from "react";
import { Reference } from "../models/reference";
import "./ReferenceCard.css";

interface Props {
    item: Reference,
}
export const ReferenceCard: FC<Props> = ({item}) => {
    console.log(item)
    return (
        <div className="cardContainer">
            <h3 className="cartTitle">{item.title}</h3>
            <div className="authorsContainer">{item.authors.join(', ')}</div>
            <p>Cited for: {item.citedFor}</p>
        </div>
    )
}