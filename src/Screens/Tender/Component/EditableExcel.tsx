import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, } from 'react-native';
import RNFS from 'react-native-fs';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { InsideHeader } from '../../../Component/Index';
import colors from '../../../Constant/Color';

const EXCEL_API_URL = 'https://procurelinc.in/EProcurementSB/eTendering/getEnvelopeCTemplate/tenderId?tenderId=2479';

//  Excel column keys
const QTY_KEY = '__EMPTY_1';
const RATE_KEY = '__EMPTY_2';
const VALUE_KEY = '__EMPTY_3';
const TOTAL_LABEL = 'TOTAL';

const EnvelopeCExcelPreview = () => {
    const [data, setData] = useState<any[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const token = useSelector((state: any) => state.token.token);

    useEffect(() => {
        loadExcelFromApi();
    }, []);

    //  ArrayBuffer → Base64
    const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return global.btoa(binary);
    };

    //  Calculate TOTAL VALUE
    const calculateTotal = (rows: any[]) =>
        rows.reduce((sum, row) => {
            if (typeof row['DEMO DEPARTEMENT'] !== 'number') return sum;
            const val = Number(row[VALUE_KEY]);
            return sum + (isNaN(val) ? 0 : val);
        }, 0);

    //  LOAD EXCEL
    const loadExcelFromApi = async () => {
        try {
            setLoading(true);

            const response = await axios.get(EXCEL_API_URL, {
                responseType: 'arraybuffer',
                headers: {
                    Authentication: `Bearer ${token.token}`,
                },
            });

            const base64 = arrayBufferToBase64(response.data);
            const workbook = XLSX.read(base64, { type: 'base64' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

            setColumns(Object.keys(rows[0] || {}));
            setData(rows);

            await RNFS.writeFile(
                `${RNFS.DocumentDirectoryPath}/envelopeC.xlsx`,
                base64,
                'base64'
            );
        } catch (e) {
            Alert.alert('Error', 'Failed to load Excel');
        } finally {
            setLoading(false);
        }
    };

    //  UPDATE CELL (QTY / RATE) + AUTO VALUE + AUTO TOTAL
    const updateCell = (rowIndex: number, key: string, value: string) => {
        const updated = [...data];
        const row = updated[rowIndex];

        //  TOTAL row locked
        if (row['DEMO DEPARTEMENT'] === TOTAL_LABEL) return;

        // Allow only QTY & RATE edit
        if (key === QTY_KEY || key === RATE_KEY) {
            row[key] = value;

            const qty = Number(row[QTY_KEY]);
            const rate = Number(row[RATE_KEY]);

            // 🔥 Auto VALUE = QTY × RATE
            row[VALUE_KEY] =
                !isNaN(qty) && !isNaN(rate) ? qty * rate : 0;
        }

        // 🔥 Update TOTAL
        const totalRowIndex = updated.findIndex(
            r => r['DEMO DEPARTEMENT'] === TOTAL_LABEL
        );

        if (totalRowIndex !== -1) {
            updated[totalRowIndex][VALUE_KEY] = calculateTotal(updated);
        }

        setData(updated);
    };

    //  SAVE UPDATED EXCEL
    const saveUpdatedExcel = async () => {
        try {
            setLoading(true);

            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

            const base64 = XLSX.write(workbook, {
                bookType: 'xlsx',
                type: 'base64',
            });

            await RNFS.writeFile(
                `${RNFS.DocumentDirectoryPath}/envelopeC_updated.xlsx`,
                base64,
                'base64'
            );

            Alert.alert('Success', 'Excel saved with auto-calculation');
        } catch (e) {
            Alert.alert('Error', 'Save failed');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <InsideHeader title='Envelope-C Excel Preview' />

            <ScrollView horizontal contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 20, backgroundColor: colors.white }}>
                <View>
                    {/* HEADER */}
                    <View style={styles.row}>
                        {columns.map(col => (
                            <Text key={col} style={styles.headerCell}>
                                {col}
                            </Text>
                        ))}
                    </View>

                    {/* DATA */}
                    <ScrollView style={{ maxHeight: 420 }}>
                        {data.map((row, rowIndex) => (
                            <View key={rowIndex} style={styles.row}>
                                {columns.map(key => {
                                    const isTotal = row['DEMO DEPARTEMENT'] === TOTAL_LABEL;
                                    const isEditable =
                                        !isTotal && (key === QTY_KEY || key === RATE_KEY);

                                    return (
                                        <TextInput
                                            key={key}
                                            value={String(row[key])}
                                            editable={isEditable}
                                            keyboardType={
                                                key === QTY_KEY || key === RATE_KEY
                                                    ? 'numeric'
                                                    : 'default'
                                            }
                                            style={[
                                                styles.cell,
                                                isTotal && styles.totalCell,
                                                key === VALUE_KEY && styles.valueCell,
                                            ]}
                                            onChangeText={text =>
                                                updateCell(rowIndex, key, text)
                                            }
                                        />
                                    );
                                })}
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>

            <TouchableOpacity style={styles.button} onPress={saveUpdatedExcel}>
                <Text style={styles.buttonText}>Save Updated Excel</Text>
            </TouchableOpacity>
        </View>
    );
};

export default EnvelopeCExcelPreview;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
    row: { flexDirection: 'row' },
    headerCell: {
        minWidth: 140,
        padding: 10,
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        fontWeight: '700',
    },
    cell: {
        minWidth: 140,
        padding: 10,
        borderWidth: 1,
        borderColor: '#cbd5e1',
    },
    valueCell: {
        backgroundColor: '#f8fafc',
    },
    totalCell: {
        backgroundColor: '#e5e7eb',
        fontWeight: '700',
    },
    button: {
        marginTop: 15,
        backgroundColor: '#2563eb',
        padding: 14,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '600',
    },
});
