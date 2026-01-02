import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { getTodayDateString } from '../utils';


export default function DailySummary({ selectedDate, db, setError }) {
	const [enable, setEnable] = useState(false);
	const [dailySummary, setDailySummary] = useState('');

	// Save daily summary
	const saveSummary = async () => {
		setError(null);
		try {
			const summaryDocRef = doc(db, 'env', process.env.NODE_ENV, 'dailySummaries', selectedDate);
			await setDoc(summaryDocRef, {
				date: selectedDate,
				summary: dailySummary.trim(),
				updatedAt: getTodayDateString(1)
			}, { merge: true });
			setEnable(false);
		} catch (err) {
			setError(err.message);
			console.error('Error saving summary:', err);
		} finally {
		}
	};

	// Load summary for selected date
	const loadSummary = async (firestoreDb = db) => {
		if (!firestoreDb) {
			setError('Firebase not initialized. Please configure first.');
			return;
		}

		setError(null);

		try {
			// Load summary for selected date
			const summaryDocRef = doc(firestoreDb, 'env', process.env.NODE_ENV, 'dailySummaries', selectedDate);
			const summaryDoc = await getDoc(summaryDocRef);
			if (summaryDoc.exists()) {
				setDailySummary(summaryDoc.data().summary || '');
			} else {
				setDailySummary('');
			}
		} catch (err) {
			// Provide specific error messages based on error code
			console.error('Firestore Error:', {
				code: err.code,
				message: err.message,
				stack: err.stack
			});
		}
	};

	const handleSummaryUpdate = (e) => {
		setDailySummary(e.target.value)
		setEnable(true);
	}

	useEffect(()=>{
		loadSummary(db);
	}, [])

	return (
		<div className="summary-section">
			<h2>Daily Summary</h2>
			<textarea
				value={dailySummary}
				onChange={handleSummaryUpdate}
				placeholder="Write a summary of your day..."
				className="summary-textarea"
				rows={dailySummary.split('\n').length}
			/>
			<button
				onClick={saveSummary}
				className="btn btn-primary"
				disabled={!enable}
			>
				Save Summary
			</button>
		</div>
	)
}