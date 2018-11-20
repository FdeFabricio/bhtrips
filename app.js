import React, { Component } from "react";
import { render } from "react-dom";
import { StaticMap } from "react-map-gl";
import DeckGL, { PolygonLayer } from "deck.gl";
import { TripsLayer } from "@deck.gl/experimental-layers";

const MAPBOX_TOKEN = process.env.MapboxAccessToken;
const DATA_URL = "data/trips.json";

export const INITIAL_VIEW_STATE = {
    longitude: -43.9594,
    latitude: -19.9175,
    zoom: 13,
    maxZoom: 16,
    pitch: 45,
    bearing: 0,
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
            loopLength = 1620, // unit corresponds to the timestamp in source data
            animationSpeed = 1, // unit time per second
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
        const {
            buildings = DATA_URL.BUILDINGS,
            trips = DATA_URL.TRIPS,
            trailLength = 10,
        } = this.props;

        return [
            new TripsLayer({
                id: "trips",
                data: trips,
                getPath: d => d.segments,
                getColor: d =>
                    d.vendor === 0 ? [253, 128, 93] : [23, 184, 190],
                opacity: 0.3,
                strokeWidth: 2,
                trailLength,
                currentTime: this.state.time,
            }),
        ];
    }

    render() {
        const { viewState, controller = true, baseMap = true } = this.props;
        return (
            <DeckGL
                layers={this._renderLayers()}
                initialViewState={INITIAL_VIEW_STATE}
                viewState={viewState}
                controller={controller}
            >
                {baseMap && (
                    <StaticMap
                        reuseMaps
                        mapStyle="mapbox://styles/mapbox/dark-v9"
                        preventStyleDiffing={true}
                        mapboxApiAccessToken={MAPBOX_TOKEN}
                    />
                )}
            </DeckGL>
        );
    }
}

export function renderToDOM(container) {
    render(<App />, container);
}
