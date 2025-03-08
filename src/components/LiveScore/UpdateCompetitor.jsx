import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const UpdateCompetitor = () => {
    const { id } = useParams(); // Preia ID-ul din URL
    const navigate = useNavigate();
    const [boulders, setBoulders] = useState([
        { try_top: 0, try_zone: 0 },
        { try_top: 0, try_zone: 0 },
        { try_top: 0, try_zone: 0 },
        { try_top: 0, try_zone: 0 },
    ]);

    const [counterTop, setCounterTop] = useState(0);
    const [counterZone, setCounterZone] = useState(0);
    const [attemptTop, setAttemptTop] = useState(0);
    const [attemptZone, setAttemptZone] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);

    const [competitorName, setCompetitorName] = useState("");

    useEffect(() => {
        const fetchCompetitor = async () => {
            const docRef = doc(db, "competitors", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setCompetitorName(data.name);
                setBoulders([
                    { try_top: data.top_try_one, try_zone: data.zone_try_one },
                    { try_top: data.top_try_two, try_zone: data.zone_try_two },
                    { try_top: data.top_try_three, try_zone: data.zone_try_three },
                    { try_top: data.top_try_four, try_zone: data.zone_try_four },
                ]);
            }
        };
        fetchCompetitor();
    }, [id]);

    // 🟢 Recalculează scorurile când se schimbă boulders
    useEffect(() => {
        setCounterTop(boulders.filter(boulder => boulder.try_top > 0).length);
        setCounterZone(boulders.filter(boulder => boulder.try_zone > 0).length);
        setAttemptTop(boulders.reduce((sum, boulder) => sum + boulder.try_top, 0));
        setAttemptZone(boulders.reduce((sum, boulder) => sum + boulder.try_zone, 0));
    }, [boulders]);

    const handleUpdate = async () => {
        const docRef = doc(db, "competitors", id);
        await updateDoc(docRef, {
            top_try_one: boulders[0].try_top,
            zone_try_one: boulders[0].try_zone,
            top_try_two: boulders[1].try_top,
            zone_try_two: boulders[1].try_zone,
            top_try_three: boulders[2].try_top,
            zone_try_three: boulders[2].try_zone,
            top_try_four: boulders[3].try_top,
            zone_try_four: boulders[3].try_zone,

            total_top: counterTop,
            total_zone: counterZone,
            attempt_top: attemptTop,
            attempt_zone: attemptZone,
            total_point: totalPoints


        });

        alert("Competitor updated!");
        navigate("/ "); // Redirecționează înapoi la LiveScoreTable
    };

    useEffect(() => {
        const newBoulders = boulders.map(boulder => {
            let points = 0;
            if (boulder.try_top === 1) {
                points = 25
            }
            if (boulder.try_top > 1) {
                points = 25 - (0.1 * boulder.try_top);
            } else if (boulder.try_zone === 1 && boulder.try_top != 1) {
                points = 10;
            } else if (boulder.try_zone > 1) {
                points = 10 - (0.1 * boulder.try_zone);
            }

            return { ...boulder, points: Math.max(points, 0) }; // Să nu avem puncte negative
        });

        setBoulders(newBoulders);

        // Calculăm totalul punctelor
        const total = newBoulders.reduce((sum, boulder) => sum + boulder.points, 0);
        setTotalPoints(total.toFixed(1));
    }, [boulders]);


    return (
        <div>
            <h2>Update Competitor: {competitorName}</h2>
            {boulders.map((boulder, index) => (
                <div key={index}>
                    <label ></label>
                    <label>Boulder {index + 1} - Top:</label>
                    <input
                        type="number"
                        min="0"
                        value={boulder.try_top}
                        onChange={(e) => {
                            const newBoulders = [...boulders];
                            newBoulders[index].try_top = Number(e.target.value);
                            setBoulders(newBoulders);
                        }}
                    />

                    <label>Zone:</label>
                    <input
                        type="number"
                        min="0"
                        value={boulder.try_zone}
                        onChange={(e) => {
                            const newBoulders = [...boulders];
                            newBoulders[index].try_zone = Number(e.target.value);
                            setBoulders(newBoulders);
                        }}
                    />
                    <label>Puncte: {boulder.points?.toFixed(2)}</label>
                </div>
            ))}
            <div className="mt-2 p-2 border bg-gray-100">
                <p>Total Top: {counterTop}</p>
                <p>Total Zone: {counterZone}</p>
                <p>Attempt Top: {attemptTop}</p>
                <p>Attempt Zone: {attemptZone}</p>
                <p>Total Points: {totalPoints}</p>

            </div>
            <button onClick={handleUpdate} className="bg-green-500 text-white p-2 rounded-md">
                Update
            </button>
        </div>
    );
};

export default UpdateCompetitor;
