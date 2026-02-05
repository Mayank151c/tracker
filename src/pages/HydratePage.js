import { useState, useEffect, useCallback } from 'react';
import { getRecord, setRecord, useConfig } from '../utils';
import { ERRORS, COLLECTIONS } from '../config/constants';
import './HydratePage.css';

const totalLevel = 12;
const waterHeight = 388;
const waterBlockHeight = 360 / totalLevel;
const slope = 3;

export default function HydratePage() {
  const [hydrateLevel, setHydrateLevel] = useState(0);
  const [enable, setEnable] = useState(true);
  const { setError, db, navigate } = useConfig();

  const setHydrate = useCallback(
    async (value) => {
      value = hydrateLevel + value;
      if (value < 0 || value > totalLevel) return;
      setError(null);
      setEnable(false);
      try {
        const updateRecordFields = {
          level: value,
          type: 'hydrate',
        };
        await setRecord(db, COLLECTIONS.ROUTINE, updateRecordFields);
        setHydrateLevel(value);
      } catch (err) {
        setError(err.message);
        console.error('Error saving hydrate routine:', err);
      } finally {
        setEnable(true);
      }
    },
    [db, setError, hydrateLevel],
  );

  const getHydrate = useCallback(async () => {
    if (!db) {
      setError(ERRORS.FIREBASE);
      return navigate('');
    }
    setError(null);

    try {
      // Get Hydrate details for today
      const record = await getRecord(db, COLLECTIONS.ROUTINE);
      setHydrateLevel(record?.level ?? 0);
    } catch (err) {
      console.error('Error getting hydrate routine:', err);
      setError(err.message);
    }
  }, [db, navigate, setError]);

  useEffect(() => {
    getHydrate();
  }, [getHydrate]);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Drink atleast 12 Glass of water daily</h2>
      <GlassFrame isEmpty={!parseInt(hydrateLevel)} level={hydrateLevel} />
      <div>
        <button id="add-btn" disabled={!enable} onClick={() => setHydrate(+1)}>
          ➕
        </button>
        <button id="del-btn" disabled={!enable} onClick={() => setHydrate(-1)}>
          ➖
        </button>
      </div>
    </div>
  );
}

function GlassFrame(props) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div id="water-label">{parseInt(props.level)}</div>
      <GlassSvg level={props.level} isEmpty={props.isEmpty} waterBodyColor={props.isEmpty ? '#d0d1d129' : '#a5b7d0'} waterLayerColor={'#d6e5f6'} />
    </div>
  );
}

function GlassSvg(props) {
  const style = { fill: props.waterBodyColor, stroke: '#0009', strokeWidth: 2 };

  const polygonPoint = `
	${200 + props.level * slope},${waterHeight - props.level * waterBlockHeight},
	${38 - props.level * slope},${waterHeight - props.level * waterBlockHeight},
	38,383,
	200,383,
	`;

  function ellipse(rx, ry, cx, cy, style) {
    return <ellipse rx={rx} ry={ry} cx={cx} cy={cy} style={style} />;
  }

  function line(x1, y1, x2, y2, style) {
    return <line x1={x1} y1={y1} x2={x2} y2={y2} style={style} />;
  }

  return (
    <svg width="238" height="400">
      {/* Glass Bottom */}
      {ellipse(81, 16, 119, 383, style)}
      {ellipse(71, 10, 119, 383, style)}
      {
        /* Water Layer */
        !props.isEmpty && (
          <>
            <polygon points={polygonPoint} style={{ fill: props.waterBodyColor }} />
            {ellipse(80 + props.level * slope, 16, 119, waterHeight - props.level * waterBlockHeight, { fill: props.waterLayerColor })}
          </>
        )
      }
      {/* Glass Top */}
      {ellipse(118, 16, 119, 18, { fill: 'none', stroke: '#0009', strokeWidth: 2 })}

      {/* Glass Sides */}
      {line(1, 19, 38, 383, style)}
      {line(237, 19, 200, 383, style)}
    </svg>
  );
}
