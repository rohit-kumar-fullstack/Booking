import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import RNFS from 'react-native-fs';
import * as XLSX from 'xlsx';
import axios from 'axios';

const EXCEL_API_URL = 'https://procurelinc.in/EProcurementSB/eTendering/getEnvelopeCTemplate/tenderId';

const EnvelopeCExcelPreview = () => {
    const [data, setData] = useState<any[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadExcelFromApi();
    }, []);

    // 📥 FETCH EXCEL BLOB + READ
    const loadExcelFromApi = async () => {
        try {
            setLoading(true);

            const urlWithParams = `${EXCEL_API_URL}?tenderId=2479`;

            // ⬇️ Fetch Excel as blob
            const response = await axios.get(urlWithParams, {
                responseType: 'arraybuffer',
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBQklOVE9QUE85NkBHTUFJTC5DT00iLCJpYXQiOjE3Njc5MzgzMDMsImV4cCI6MTc2Nzk3NDMwM30.NiT5iOIdQH0y8TutLfLVp9ApQIAI3NHbkmRjb1fl-JlGxeyX21n3oPGvU6sDw_uU9iTZHI183e2FH_IL2sZYpQ`,
                },
            });
            console.log(response, '--------------------------------------');

            // ⬇️ Save file locally
            const filePath = `${RNFS.DocumentDirectoryPath}/envelopeC.xlsx`;
            const buffer = Buffer.from(response.data, 'binary'); // convert arraybuffer to buffer
            await RNFS.writeFile(filePath, buffer.toString('base64'), 'base64');

            // 📖 Read Excel
            const workbook = XLSX.readFile(filePath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

            setData(jsonData);
            setColumns(Object.keys(jsonData[0] || {}));
        } catch (error: any) {
            console.log('Excel load error:', error);
            Alert.alert('Error', error.message || 'Unable to load Excel');
        } finally {
            setLoading(false);
        }
    };

    // ✏️ UPDATE CELL
    const updateCell = (rowIndex: number, key: string, value: string) => {
        const updated = [...data];
        updated[rowIndex][key] = value;
        setData(updated);
    };

    // 💾 SAVE UPDATED EXCEL (LOCAL)
    const saveUpdatedExcel = async () => {
        try {
            setLoading(true);

            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

            const base64Excel = XLSX.write(workbook, { bookType: 'xlsx', type: 'base64' });
            const updatedPath = `${RNFS.DocumentDirectoryPath}/envelopeC_updated.xlsx`;

            await RNFS.writeFile(updatedPath, base64Excel, 'base64');

            Alert.alert('Success', 'Updated Excel saved successfully');
            console.log('Saved at:', updatedPath);
        } catch (error) {
            console.log('Save error:', error);
            Alert.alert('Error', 'Failed to save Excel');
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
            <Text style={styles.title}>Envelope-C Excel Preview</Text>

            <ScrollView horizontal>
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
                                {columns.map(key => (
                                    <TextInput
                                        key={key}
                                        value={String(row[key])}
                                        style={styles.cell}
                                        onChangeText={text => updateCell(rowIndex, key, text)}
                                    />
                                ))}
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
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
    },
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
