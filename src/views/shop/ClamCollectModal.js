import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { getExplorerAddressLink, ChainId } from "@usedapp/core";
import { connect } from "redux-zero/react";
import { collectClam } from "../../web3/clam";

import "./index.scss";

import Card from "../../components/Card";

import { collect } from "../../web3/clam";
import { clamPresaleAddress } from "../../web3/constants";

import ClamPic from "../../assets/collect-clam.png";
import { actions } from "../../store/redux";
import { truncate } from "lodash";

const ClamCollectModal = ({
  setModalToShow,
  account: { address },
  updateCharacter,
  updateAccount,
}) => {
  const { handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    console.log({ data, address });
    setIsLoading(true);

    await collectClam(address)
      .then(() => {
        setIsLoading(false);

        updateAccount({ clamToCollect: null });

        updateCharacter({
          name: "diego",
          action: "clam_shop.collect_congrats.text",
          button: {
            text: "Gotcha",
            dismiss: truncate,
          },
        });
        setModalToShow("display");
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
        updateAccount({ error: e.message });
        updateCharacter({
          name: "diego",
          action: "clam_presale.error.text",
          button: {
            text: undefined,
          },
        });
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <div className="bg-white flex-1 justify-center  md:flex items-center">
            <img src={ClamPic} width="300" />
          </div>

          <div className="py-2 flex flex-col">
            {isLoading ? (
              <button
                disabled={isLoading}
                type="submit"
                className="flex justify-content-center items-center block uppercase text-center shadow bg-yellow-200 text-yellow-600 text-xl py-3 px-10 rounded-xl cursor-not-allowed"
              >
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-yellow-600"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>{" "}
                Sending transaction...
              </button>
            ) : (
              <button
                type="submit"
                className="block font-extrabold text-center shadow bg-blue-600 hover:bg-blue-700 focus:shadow-outline focus:outline-none text-white text-xl py-3 px-10 rounded-2xl"
              >
                Collect Clam
              </button>
            )}
          </div>
        </Card>
      </form>
    </>
  );
};

const mapToProps = (store) => store;
export default connect(mapToProps, actions)(ClamCollectModal);
