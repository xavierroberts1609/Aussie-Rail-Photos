"use client";

import { useEffect, useState } from "react";
import { STATES, NO_STATION_LABEL } from "@/lib/locations";

export type LocationValue = {
  state: string;
  suburb: string;
  station: string;
  locationDetail: string;
};

const OTHER = "__other__";
const NO_STATION = "__none__";

export default function LocationFields({
  value,
  onChange,
}: {
  value: LocationValue;
  onChange: (value: LocationValue) => void;
}) {
  const [suburbOptions, setSuburbOptions] = useState<string[]>([]);
  const [stationOptions, setStationOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [suburbMode, setSuburbMode] = useState<"select" | "other">("select");
  const [stationMode, setStationMode] = useState<"select" | "other">("select");

  useEffect(() => {
    if (!value.state) {
      setSuburbOptions([]);
      setStationOptions([]);
      setSuburbMode("select");
      setStationMode("select");
      return;
    }
    setLoading(true);
    fetch(`/api/locations?state=${encodeURIComponent(value.state)}`)
      .then((res) => res.json())
      .then((data) => {
        const suburbs: string[] = data.suburbs ?? [];
        const stations: string[] = data.stations ?? [];
        setSuburbOptions(suburbs);
        setStationOptions(stations);
        setSuburbMode(value.suburb && !suburbs.includes(value.suburb) ? "other" : "select");
        setStationMode(value.station && !stations.includes(value.station) ? "other" : "select");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.state]);

  function update(patch: Partial<LocationValue>) {
    onChange({ ...value, ...patch });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="label-field" htmlFor="state">State</label>
        <select
          id="state"
          value={value.state}
          onChange={(e) => update({ state: e.target.value, suburb: "", station: "" })}
          className="input-field"
        >
          <option value="">Select state</option>
          {STATES.map((s) => (
            <option key={s.code} value={s.code}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field" htmlFor="suburb">Suburb</label>
          {suburbMode === "other" ? (
            <div className="flex gap-2">
              <input
                id="suburb"
                value={value.suburb}
                onChange={(e) => update({ suburb: e.target.value })}
                placeholder="Type suburb"
                disabled={!value.state}
                className="input-field"
              />
              {suburbOptions.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSuburbMode("select");
                    update({ suburb: "" });
                  }}
                  className="shrink-0 rounded-sm border border-ink-border px-3 text-xs text-bone-muted hover:border-gold/50 hover:text-gold"
                >
                  Choose
                </button>
              )}
            </div>
          ) : (
            <select
              id="suburb"
              value={value.suburb}
              disabled={!value.state || loading}
              onChange={(e) => {
                if (e.target.value === OTHER) {
                  setSuburbMode("other");
                  update({ suburb: "" });
                } else {
                  update({ suburb: e.target.value });
                }
              }}
              className="input-field"
            >
              <option value="">{value.state ? "Select suburb" : "Select a state first"}</option>
              {suburbOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
              <option value={OTHER}>Other (type new)...</option>
            </select>
          )}
        </div>

        <div>
          <label className="label-field" htmlFor="station">Closest Station</label>
          {stationMode === "other" ? (
            <div className="flex gap-2">
              <input
                id="station"
                value={value.station}
                onChange={(e) => update({ station: e.target.value })}
                placeholder="Type station"
                disabled={!value.state}
                className="input-field"
              />
              <button
                type="button"
                onClick={() => {
                  setStationMode("select");
                  update({ station: "" });
                }}
                className="shrink-0 rounded-sm border border-ink-border px-3 text-xs text-bone-muted hover:border-gold/50 hover:text-gold"
              >
                Choose
              </button>
            </div>
          ) : (
            <select
              id="station"
              value={value.station === "" ? NO_STATION : value.station}
              disabled={!value.state || loading}
              onChange={(e) => {
                if (e.target.value === OTHER) {
                  setStationMode("other");
                  update({ station: "" });
                } else if (e.target.value === NO_STATION) {
                  update({ station: "" });
                } else {
                  update({ station: e.target.value });
                }
              }}
              className="input-field"
            >
              <option value="" disabled hidden>
                {value.state ? "Select station" : "Select a state first"}
              </option>
              <option value={NO_STATION}>{NO_STATION_LABEL}</option>
              {stationOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
              <option value={OTHER}>Other (type new)...</option>
            </select>
          )}
        </div>
      </div>

      <div>
        <label className="label-field" htmlFor="locationDetail">Extra Location Detail</label>
        <input
          id="locationDetail"
          value={value.locationDetail}
          onChange={(e) => update({ locationDetail: e.target.value })}
          placeholder="e.g. Level crossing on Foster St"
          className="input-field"
        />
      </div>

      <input type="hidden" name="state" value={value.state} />
      <input type="hidden" name="suburb" value={value.suburb} />
      <input type="hidden" name="station" value={value.station} />
      <input type="hidden" name="locationDetail" value={value.locationDetail} />
    </div>
  );
}
