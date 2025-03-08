import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import AddCompetitors from "./AddCompetitors";

const LiveScoreTable = () => {
  const [competitor, setCompetitor] = useState([]);
  const competitorsColectionRef = collection(db, "competitors");

  const deletCompetiors = async (id) => {
    const competitorDoc = doc(db, "competitors", id);
    console.log(id);
    await deleteDoc(competitorDoc);
    getCompetitors();
  };

  //Read the data
  const getCompetitors = async () => {
    try {
      const data = await getDocs(competitorsColectionRef);
      const filteredData = data.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          name: docData.name,
          attempt_top: docData.attempt_top,
          attempt_zone: docData.attempt_zone,
          total_top: docData.total_top,
          total_zone: docData.total_zone,
          total_point: docData.total_point,
          boulders: [
            { try_top: docData.top_try_one, try_zone: docData.zone_try_one },
            { try_top: docData.top_try_two, try_zone: docData.zone_try_two },
            {
              try_top: docData.top_try_three,
              try_zone: docData.zone_try_three,
            },
            { try_top: docData.top_try_four, try_zone: docData.zone_try_four },
          ],
        };
      });

      // 🏆 Sortare descrescătoare după `total_point`
      const sortedData = filteredData.sort(
        (a, b) => b.total_point - a.total_point
      );

      setCompetitor(sortedData);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getCompetitors();
  }, []);

  useEffect(() => {
    console.log(competitor);
  }, [competitor]);

  const navigate = useNavigate();

  const updateCompetitor = (id) => {
    navigate(`/update-competitor/${id}`); // Redirecționează către UpdateCompetitor
  };

  return (
    <div className="p-5">
      <AddCompetitors onCompetitorAdded={getCompetitors} />
      <table className="table-fixed w-[100%] max-w-[1000px] ml-auto mr-auto">
        <thead className="bg-slate-950 text-white">
          <tr className="border">
            <th className="min-w-14">Rank</th>
            <th className="min-w-14">Name</th>
            <th className="min-w-14">1</th>
            <th className="min-w-14">2</th>
            <th className="min-w-14">3</th>
            <th className="min-w-14">4</th>
            <th className="min-w-14">T</th>
            <th className="min-w-14">Z</th>
            <th className="min-w-14">A.T</th>
            <th className="min-w-14">A.Z</th>
            <th className="min-w-14">T.P</th>
            <th className="min-w-14"></th>
            <th className="min-w-14"></th>
          </tr>
        </thead>
        <tbody>
          {competitor.map((competitor, index) => (
            <tr key={index} className="border">
              <td className="text-center p-2">{index + 1}</td>
              <td className="text-center p-2">{competitor.name}</td>
              {competitor.boulders.map((boulder, index) => (
                <td className={`boulder_${index + 1} `} key={index}>
                  <div className="try_container max-w-10 ml-auto mr-auto">
                    <div
                      className={
                        boulder.try_top == null || boulder.try_top === 0
                          ? "try_top text-sm opacity-0 pl-2 pr-2 rounded-t"
                          : "try_top text-sm bg-green-400 pl-2 pr-2 rounded-t"
                      }
                    >
                      {boulder.try_top == null ? "null" : boulder.try_top}
                    </div>
                    <div
                      className={
                        boulder.try_zone == null || boulder.try_zone === 0
                          ? "try_zone text-sm opacity-0 pl-2 pr-2 rounded-b"
                          : "try_zone text-sm bg-green-400 text-right pl-2 pr-2 rounded-b"
                      }
                    >
                      {boulder.try_zone == null ? "null" : boulder.try_zone}
                    </div>
                  </div>
                </td>
              ))}

              <td className="total_top text-center ">{competitor.total_top}</td>
              <td className="total_zone text-center ">
                {competitor.total_zone}
              </td>

              <td className="attempt_top text-center ">
                {competitor.attempt_top}
              </td>
              <td className="attempt_zone text-center ">
                {competitor.attempt_zone}
              </td>
              <td className="attempt_zone text-center ">
                {competitor.total_point}
              </td>
              <td>
                <button
                  onClick={() => updateCompetitor(competitor.id)}
                  className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-500"
                >
                  Update
                </button>
              </td>
              <td>
                <button
                  onClick={() => deletCompetiors(competitor.id)}
                  className="bg-red-600 text-white p-2 rounded-md transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LiveScoreTable;
