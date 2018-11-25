import React, { Component } from "react";
import { render } from "react-dom";
import { StaticMap } from "react-map-gl";
import DeckGL, { PolygonLayer } from "deck.gl";
import { TripsLayer } from "@deck.gl/experimental-layers";

const MAPBOX_TOKEN = process.env.MapboxAccessToken;
const DATA_URL = "data/trips_weekday.json";

export const INITIAL_VIEW_STATE = {
    longitude: -43.9594,
    latitude: -19.9175,
    zoom: 11,
    maxZoom: 16,
};

export class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: 0,
        };
    }

    componentDidMount() {
        this._animate();
    }

    componentWillUnmount() {
        if (this._animationFrame) {
            window.cancelAnimationFrame(this._animationFrame);
        }
    }

    _animate() {
        const {
            loopLength = 1440, // unit corresponds to the timestamp in source data
            animationSpeed = 5, // unit time per second
        } = this.props;
        const timestamp = Date.now() / 1000;
        const loopTime = loopLength / animationSpeed;

        this.setState({
            time: ((timestamp % loopTime) / loopTime) * loopLength,
        });
        this._animationFrame = window.requestAnimationFrame(
            this._animate.bind(this)
        );
    }

    _renderLayers() {
        return [
            new TripsLayer({
                id: "trips",
                data: DATA_URL,
                getPath: d => d.segments,
                getColor: d =>
                    d.vendor === 0 ? [253, 128, 93] : [23, 184, 190],
                opacity: 0.3,
                strokeWidth: 2,
                trailLength: 15,
                currentTime: this.state.time,
            }),
        ];
    }

    render() {
        const { viewState, controller = true, baseMap = true } = this.props;
        return (
            <span>
                <DeckGL
                    layers={this._renderLayers()}
                    initialViewState={INITIAL_VIEW_STATE}
                    viewState={viewState}
                    controller={controller}
                >
                    {baseMap && (
                        <StaticMap
                            reuseMaps
                            mapStyle="mapbox://styles/fdefabricio/cjorv8swk1cij2rmmpafu8ufi"
                            preventStyleDiffing={true}
                            mapboxApiAccessToken={MAPBOX_TOKEN}
                        />
                    )}
                </DeckGL>
                <Timer time={this.state.time} />
            </span>
        );
    }
}

export function renderToDOM(container) {
    render(<App />, container);
}

class Timer extends React.Component {
    render() {
        return (
            <h1
                style={{
                    position: "absolute",
                    bottom: 100,
                    left: 100,
                    color: "#EFE9AC",
                    backgroundColor: "#FF4130",
                    padding: 20,
                    width: 100,
                    textAlign: "center",
                }}
            >
                {Math.floor(this.props.time / 60).toLocaleString("en-US", {
                    minimumIntegerDigits: 2,
                    useGrouping: false,
                })}
                :{""}
                {Math.floor(this.props.time % 60).toLocaleString("en-US", {
                    minimumIntegerDigits: 2,
                    useGrouping: false,
                })}
            </h1>
        );
    }
}
