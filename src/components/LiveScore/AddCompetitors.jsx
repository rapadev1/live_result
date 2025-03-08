import React, { useState } from "react";
import { db } from "../../config/firebase";
import { addDoc, collection } from "firebase/firestore";

const AddCompetitors = ({ onCompetitorAdded }) => {
    const competitorsCollectionRef = collection(db, "competitors");

    const [competitorName, setCompetitorName] = useState("");
    const [points, setPoints] = useState(0)
    const [boulders, setBoulders] = useState([
        { top: 0, zone: 0 },
        { top: 0, zone: 0 },
        { top: 0, zone: 0 },
        { top: 0, zone: 0 }
    ]);

    // Funcție pentru a actualiza valorile boulderilor
    const handleChange = (index, field, value) => {
        setBoulders(prevBoulders =>
            prevBoulders.map((boulder, i) =>
                i === index ? { ...boulder, [field]: Number(value) } : boulder
            )
        );
    };

    // Calcularea scorurilor direct
    const counterTop = boulders.filter(boulder => boulder.top > 0).length;
    const counterZone = boulders.filter(boulder => boulder.zone > 0).length;
    const attemptTop = boulders.reduce((sum, boulder) => sum + boulder.top, 0);
    const attemptZone = boulders.reduce((sum, boulder) => sum + boulder.zone, 0);


    // Funcție pentru a adăuga competitorul în Firestore
    const onSubmitCompetitor = async () => {
        if (!competitorName.trim()) {
            alert("Please enter a competitor name!");
            return;
        }


        try {
            await addDoc(competitorsCollectionRef, {
                name: competitorName,
                top_try_one: boulders[0].top,
                top_try_two: boulders[1].top,
                top_try_three: boulders[2].top,
                top_try_four: boulders[3].top,

                zone_try_one: boulders[0].zone,
                zone_try_two: boulders[1].zone,
                zone_try_three: boulders[2].zone,
                zone_try_four: boulders[3].zone,

                total_top: counterTop,
                total_zone: counterZone,

                attempt_top: attemptTop,
                attempt_zone: attemptZone,

                total_point: points
            });

            alert("Competitor added successfully!");
            setCompetitorName("");
            setPoints(0)
            setBoulders([
                { top: 0, zone: 0 },
                { top: 0, zone: 0 },
                { top: 0, zone: 0 },
                { top: 0, zone: 0 }
            ]);
            onCompetitorAdded()
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto border rounded-lg">
            <input
                type="text"
                placeholder="Competitor Name"
                value={competitorName}
                onChange={(e) => setCompetitorName(e.target.value)}
                className="block w-full p-2 mb-2 border"
            />

            <div className="grid grid-cols-2 gap-2">
                {boulders.map((boulder, index) => (
                    <div key={index} className="border p-2">
                        <input
                            type="number"
                            min="0"
                            placeholder={`Boulder ${index + 1} - Top`}
                            value={boulder.top}
                            onChange={(e) => handleChange(index, "top", e.target.value)}
                            className="block w-full p-1 mb-1 border"
                        />
                        <input
                            type="number"
                            min="0"
                            placeholder={`Boulder ${index + 1} - Zone`}
                            value={boulder.zone}
                            onChange={(e) => handleChange(index, "zone", e.target.value)}
                            className="block w-full p-1 border"
                        />
                    </div>
                ))}
            </div>

            <div className="mt-2 p-2 border bg-gray-100">
                <p>Total Top: {counterTop}</p>
                <p>Total Zone: {counterZone}</p>
                <p>Attempt Top: {attemptTop}</p>
                <p>Attempt Zone: {attemptZone}</p>
                <p>Points: {points}</p>
            </div>

            <button
                onClick={onSubmitCompetitor}
                className="block w-full mt-2 bg-blue-500 text-white p-2 rounded"
            >
                Submit Competitor
            </button>
        </div>
    );
};

export default AddCompetitors;
