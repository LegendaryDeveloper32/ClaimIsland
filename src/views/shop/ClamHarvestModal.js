import React, { useEffect, useState } from "react";
import { connect } from "redux-zero/react";
import { formatUnits } from "@ethersproject/units";
import { Link } from "react-router-dom";

import {
  getClamValueInShellToken,
  getPearlValueInShellToken,
  harvestClamForShell,
  getClamIncubationTime,
} from "../../web3/clam";

import { getCurrentBlockTimestamp } from "../../web3";

import "./index.scss";

import { actions } from "../../store/redux";
import { Modal, useModal } from "components/Modal";

import {
  harvestClamSpeak,
  harvestCongrats,
  harvestError,
  harvestChooseClams,
  harvestNoClamsAvailable,
} from "./character/HarvestClam";

const formatShell = (value) => (value ? formatUnits(String(value), 18) : "0");

const ClamItem = ({ clam, clamValueInShellToken, pearlValueInShellToken, harvestClam }) => {
  const { tokenId, img } = clam;
  const { pearlProductionCapacity, pearlsProduced } = clam.clamDataValues;
  const harvestableShell =
    +clamValueInShellToken > 0
      ? +clamValueInShellToken + +pearlsProduced * +pearlValueInShellToken
      : "0";

  return (
    <div>
      <div className="card bg-white shadow-lg overflow-visible w-full border-4 border-gray-50 hover:border-4 hover:border-blue-200 ">
        <div className="flex-shrink-0">
          <img className="h-64 w-full object-fill" src={img} alt="" />
        </div>
        <div className="flex-1 bg-white p-6 flex flex-col justify-between">
          <div className="flex-1">
            <div className="text-sm font-medium flex justify-between">
              <div className="px-4 py-2 badge badge-success">#{tokenId}</div>
              <Link
                to={`/saferoom/clam?id=${tokenId}`}
                className="font-montserrat underline"
                style={{ color: "#757575" }}
              >
                View in saferoom
              </Link>
            </div>
            <div className="block mt-2">
              <div className="border rounded border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">$SHELL</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {formatShell(harvestableShell)}
                    </dd>
                  </div>
                  <div className="bg-gray-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Lifespan</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {+pearlProductionCapacity - +pearlsProduced} pearls
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-full">
              <button
                className="btn btn-info mt-4 font-montserrat font-bold w-full"
                onClick={() => harvestClam(tokenId)}
              >
                Harvest
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const formatDuration = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds - hours * 3600 - minutes * 60;

  return [`${hours}h`, `${minutes}m`, `${seconds}s`].filter((item) => item[0] !== "0").join(" ");
};

const ClamHarvestModal = ({
  setModalToShow,
  account: { address, clamBalance, ...stateAccount },
  updateCharacter,
  updateAccount,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [clams, setClams] = useState([]);
  const [message, setMessage] = useState("Loading...");
  const [clamValueInShellToken, setClamValueInShellToken] = useState("0");
  const [pearlValueInShellToken, setPearlValueInShellToken] = useState("0");

  const { isShowing, toggleModal } = useModal({ show: true });

  const harvestClam = async (tokenId) => {
    toggleModal();
    // character speaks
    harvestClamSpeak({ updateCharacter, setModalToShow }, async () => {
      try {
        await harvestClamForShell(tokenId, address);
        harvestCongrats({ updateCharacter, setModalToShow }); // character speaks
        setModalToShow(null);
      } catch (e) {
        console.error(e);
        updateAccount({ error: e.message });
        harvestError({ updateCharacter }); // character speaks
      }
    });
  };

  const closeModal = () => {
    toggleModal();
    setModalToShow(null);
  };

  useEffect(async () => {
    try {
      setIsLoading(true);
      const incubationtime = await getClamIncubationTime();

      if (+clamBalance > 0) {
        const currentBlockTimestamp = await getCurrentBlockTimestamp();

        const filteredClams = stateAccount.clams.filter(
          ({ clamDataValues: { pearlProductionCapacity, pearlsProduced, birthTime } }) => {
            return (
              +pearlsProduced < +pearlProductionCapacity &&
              currentBlockTimestamp > +birthTime + +incubationtime
            );
          }
        );

        setClams(filteredClams);

        if (filteredClams.length > 0) {
          setMessage(``);
          harvestChooseClams({ updateCharacter, setModalToShow }); // character speaks
        } else {
          const hours = formatDuration(+incubationtime);
          setMessage(
            `None of your clams are able to be harvested.
           They must be either alive or be past the ${hours} incubation period once they have been farmed.`
          );
          harvestNoClamsAvailable({ updateCharacter, setModalToShow, hours }); // character speaks
        }

        setIsLoading(false);
      } else {
        // clam balance is zero
        const hours = formatDuration(+incubationtime);
        harvestNoClamsAvailable({ updateCharacter, setModalToShow, hours }); // character speaks
        setIsLoading(false);
      }

      setClamValueInShellToken(await getClamValueInShellToken());
      setPearlValueInShellToken(await getPearlValueInShellToken());
    } catch (error) {
      console.log({ error });
    }
  }, [address, clamBalance]);

  return (
    <div className="HarvestModal">
      <Modal isShowing={isShowing} onClose={closeModal} width={"90rem"} title={"Choose a Clam"}>
        {isLoading ? (
          <div>
            <h1>Loading ...</h1>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : (
          <div>
            {clams.length && !isLoading ? (
              <div className="ClamDeposit max-h-160 overflow-y-auto p-2">
                <div>
                  <h3 className="heading">{message}</h3>
                  <div className="grid md:grid-cols-4 grid-cols-1 gap-4 flex-2">
                    {clams.map((clam, i) => (
                      <ClamItem
                        key={i}
                        clam={clam}
                        harvestClam={harvestClam}
                        clamValueInShellToken={clamValueInShellToken}
                        pearlValueInShellToken={pearlValueInShellToken}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full bg-white shadow-md rounded-xl text-center text-2xl p-5 text-black">
                You&#39;ve got no clams ready for harvest at the moment
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

const mapToProps = (store) => store;
export default connect(mapToProps, actions)(ClamHarvestModal);
