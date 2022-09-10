import React, {useContext} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowDown, faArrowUp, faClockRotateLeft, faClose,
    faInfo, faPingPongPaddleBall
} from "@fortawesome/free-solid-svg-icons";
import {DialogContext} from "@/common/contexts/Dialog";
import {SpeedtestContext} from "@/common/contexts/Speedtests";
import {deleteRequest} from "@/common/utils/RequestUtil";
import "./styles.sass";
import {averageResultDialog, resultDialog} from "@/pages/Home/components/Speedtest/utils/infos";
import {errors} from "@/pages/Home/components/Speedtest/utils/errors";
import {tooltips} from "@/pages/Home/components/Speedtest/utils/tooltips";

function SpeedtestComponent(props) {
    const [setDialog] = useContext(DialogContext);
    const updateTests = useContext(SpeedtestContext)[1];

    let errorMessage = "Unbekannter Fehler: " + props.error;

    let isAverage = props.type === "average";
    let timeString = (String(isAverage ? props.time.getDate() : props.time.getHours()).padStart(2, '0')) + (isAverage ? "." : ":")
        + (String(isAverage ? (props.time.getMonth() + 1) : props.time.getMinutes()).padStart(2, '0'));

    if (props.error) {
        for (let errorsKey in errors)
            if (props.error.includes(errorsKey)) errorMessage = errors[errorsKey];
    }

    const showErrorDialog = () => setDialog({
        title: "Test fehlgeschlagen",
        description: errorMessage + ". Bitte überprüfe weitestgehend, ob das öfters passiert.",
        buttonText: "Okay",
        unsetButton: "Test löschen",
        onClear: () => deleteRequest(`/speedtests/${props.id}`).then(updateTests)
    });

    const showInfoDialog = () => {
        if (props.type === "average") {
            setDialog({
                title: "Durchschnittsgeschwindigkeit",
                buttonText: "Okay",
                description: averageResultDialog(timeString, props)
            });
        } else {
            setDialog({
                title: "Testergebnis",
                description: resultDialog(props),
                buttonText: "Okay",
                unsetButton: "Test löschen",
                onClear: () => deleteRequest(`/speedtests/${props.id}`).then(updateTests)
            });
        }
    }

    return (
        <div className="speedtest">
            <div className="date">
                <div className="tooltip-element">
                    <FontAwesomeIcon icon={props.error ? faInfo : faClockRotateLeft}
                                     className={"container-icon help-icon icon-" + (props.error ? "error" : "blue")}
                                     onClick={props.error ? showErrorDialog : showInfoDialog}/>
                    <span className="tooltip">{tooltips[props.type]}</span>
                </div>
                <h2 className="date-text">{(isAverage ? "Am " : "Um ") + timeString}</h2>
            </div>
            <div className="speedtest-row">
                <FontAwesomeIcon icon={props.error ? faClose : faPingPongPaddleBall}
                                 className={"speedtest-icon icon-" + props.pingLevel}/>
                <h2 className="speedtest-text">{props.error ? "" : props.ping}</h2>
            </div>
            <div className="speedtest-row">
                <FontAwesomeIcon icon={props.error ? faClose : faArrowDown}
                                 className={"speedtest-icon icon-" + props.downLevel}/>
                <h2 className="speedtest-text">{props.error ? "" : props.down}</h2>
            </div>
            <div className="speedtest-row">
                <FontAwesomeIcon icon={props.error ? faClose : faArrowUp}
                                 className={"speedtest-icon icon-" + props.upLevel}/>
                <h2 className="speedtest-text">{props.error ? "" : props.up}</h2>
            </div>
        </div>
    );
}

export default SpeedtestComponent;