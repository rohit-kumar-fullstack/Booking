import {
    ActivityIndicator,
    Alert,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { use, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import MyInput from '../../../../src/Component/MyInput';
import { pick, types } from '@react-native-documents/picker';
import { InsideHeader } from '../../../Component/Index';
import colors from '../../../Constant/Color';

type EnvelopeType = 'A' | 'B' | 'C';
type EnvelopeFormState = {
    A: Record<number, string>;
    B: Record<number, string>;
    C: Record<number, string>;
};

interface EnvelopeButtonProps {
    title: string;
    onPress: () => void;
}

interface InfoRowProps {
    title: string;
    value: string;
}

interface TenderBiddingData {
    data?: {
        tenderNumber?: string;
        nitNo?: string;
        emdInFig?: string;
        tenderRebid?: boolean;
        showEA?: boolean;
        showEB?: boolean;
        showEC?: boolean;
        tenderEnvelopeAList?: any[];
        tenderEnvelopeBList?: any[];
        tenderEnvelopeCList?: any[];
    };
}

const TenderBidding = () => {
    const route = useRoute();
    const navigation = useNavigation();

    const [bidData] = useState<any>(route.params?.tenderData || null);
    const tenderData = route.params?.bidData || null;
    const [activeEnvelope, setActiveEnvelope] = useState<EnvelopeType | null>('A');
    const [isLoading, setIsLoading] = useState(false);
    const [envelopForm, setEnvelopForm] = useState<EnvelopeFormState>({
        A: {},
        B: {},
        C: {},
    });
    const [loading, setLoading] = useState(false)
    const [loadingUpload, setLoadingUpload] = useState(false)
    const [check, setCheck] = useState(false)
   

    const InfoRow = ({ title, value }: InfoRowProps) => (
        <View style={styles.infoRow}>
            <Text style={styles.label}>{title}</Text>
            <Text style={styles.value}>{value || '-'}</Text>
        </View>
    );

    const EnvelopeButton = ({ title, envelopeType, onPress }: EnvelopeButtonProps & { envelopeType: EnvelopeType }) => (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.envelopeButton,
                {
                    borderWidth: activeEnvelope === envelopeType ? 1 : 0,
                    borderColor: activeEnvelope === envelopeType ? colors.primary : 'transparent'
                }
            ]}
        >
            <Text style={styles.envelopeButtonText}>{title}</Text>
        </TouchableOpacity>
    );


    const handleEnvelopeChange = (
        envelopeType: EnvelopeType,
        sequenceId: number,
        value: any
    ) => {
        setEnvelopForm(prev => ({
            ...prev,
            [envelopeType]: {
                ...prev[envelopeType],
                [sequenceId]: value,
            },
        }));
    };

    const pickPdf = async (
        envelopeType: EnvelopeType,
        sequenceId: number
    ) => {
        try {
            const res = await pick({
                type: types.pdf,
                allowMultiSelection: false,
            });

            const file = res[0];

            handleEnvelopeChange(envelopeType, sequenceId, file);
        } catch (err: any) {
            if (err?.code === 'DOCUMENT_PICKER_CANCELED') {
                return;
            }
            console.error(err);
        }
    };


    const renderEnvelopeItem = ({
        item,
        envelopeType,
    }: {
        item: any;
        envelopeType: EnvelopeType;
    }) => {
        const sequenceId = item?.[`tenderEnvelope${envelopeType}SequnceId`];

        if (!sequenceId) {
            return null;
        }

        const labelName = item?.[`labelName${envelopeType}`] || '';
        const labelType = item?.[`labelType${envelopeType}`] || '';

        const showInput =
            activeEnvelope === envelopeType !== 'C' &&
            !bidData?.[`envelope${envelopeType}SubmittStatus`];


        return (
            <View key={sequenceId}>
                <View style={styles.envelopeItem}>
                    <View style={{ flexDirection: 'row', gap: 20 }}>
                        {/* <Text style={styles.label}>Label Name</Text> */}
                        <Text style={styles.value}>{labelName || '-'}</Text>
                        {item?.[`labelMandatory${activeEnvelope}`] && <Text style={{ color: validateEnvelope() ? 'gray' : 'red', }}>*</Text>}

                    </View>

                    {/* <View>
            <Text style={styles.label}>Label Type</Text>
            <Text style={styles.value}>{labelType || '-'}</Text>
          </View> */}
                </View>

                {showInput ? (
                    <>
                        {labelType === '1' && (
                            <MyInput
                                placeholder={`Enter ${labelName} numeric value`}
                                value={envelopForm?.[envelopeType]?.[sequenceId] ?? ''}
                                onChangeText={(text: string) =>
                                    handleEnvelopeChange(envelopeType, sequenceId, text)
                                }
                                keyboardType="numeric"
                            />
                        )}

                        {labelType === '2' && (
                            <MyInput
                                placeholder={`Enter ${labelName} Alph-numeric value`}
                                value={envelopForm?.[envelopeType]?.[sequenceId] ?? ''}
                                onChangeText={(text: string) =>
                                    handleEnvelopeChange(envelopeType, sequenceId, text)
                                }
                                keyboardType="default"
                            />
                        )}
                        {labelType === '3' && (
                            <>
                                <TouchableOpacity
                                    style={[
                                        styles.envelopeButton,
                                        { borderColor: colors.primary, borderWidth: 1, marginBottom: 8 }
                                    ]}
                                    onPress={() => pickPdf(activeEnvelope, sequenceId)}
                                >
                                    <Text style={styles.envelopeButtonText}>
                                        {envelopForm?.[activeEnvelope]?.[sequenceId]
                                            ? 'Change Document'
                                            : 'Upload Document'}
                                    </Text>
                                </TouchableOpacity>

                                {envelopForm?.[activeEnvelope]?.[sequenceId] && (
                                    <Text style={{ fontSize: 12, color: '#555' }}>
                                        {(envelopForm[activeEnvelope][sequenceId] as any)?.name}
                                    </Text>
                                )}

                            </>
                        )}

                        {labelType === '4' && (
                            <MyInput
                                placeholder={`Enter ${labelName} currency value`}
                                value={envelopForm?.[envelopeType]?.[sequenceId] ?? ''}
                                onChangeText={(text: string) =>
                                    handleEnvelopeChange(envelopeType, sequenceId, text)
                                }
                                keyboardType="numeric"
                            />
                        )}

                    </>
                ) : <Text>Envelop {activeEnvelope} unavailable</Text>}
            </View>
        );
    };

    const hasEnvelopes = () => {
        const hasA = tenderData?.tenderEnvelopeAList?.length > 0;
        const hasB = tenderData?.tenderEnvelopeBList?.length > 0;
        // const hasC = tenderData?.tenderEnvelopeCList?.length > 0;
        return hasA || hasB;
    };

    const digitToWordMap: Record<string, string> = {
        '0': 'Zero',
        '1': 'One',
        '2': 'Two',
        '3': 'Three',
        '4': 'Four',
        '5': 'Five',
        '6': 'Six',
        '7': 'Seven',
        '8': 'Eight',
        '9': 'Nine',
    };

    const convertDigitsToWords = (value: string): string => {
        return value
            .split('')
            .map(digit => digitToWordMap[digit] || '')
            .join(' ') || value;
    };

    const buildEnvelopePayload = () => {
        const list =
            bidData?.[`tenderEnvelope${activeEnvelope}List`] || [];
        const formValues = envelopForm?.[activeEnvelope] || {};

        // 🔹 NON-FILE FIELDS (labelType !== '3')
        const saveData = list
            .filter(
                (item: any) =>
                    item[`labelType${activeEnvelope}`] !== '3'
            )
            .map((item: any) => {
                const seqId =
                    item[`tenderEnvelope${activeEnvelope}SequnceId`];
                const value = formValues[seqId];

                return {
                    [`tenderEnvelope${activeEnvelope}SequnceId`]: seqId,
                    [`labelName${activeEnvelope}`]:
                        item[`labelName${activeEnvelope}`],
                    [`labelType${activeEnvelope}`]:
                        item[`labelType${activeEnvelope}`],
                    [`labelMandatory${activeEnvelope}`]:
                        item[`labelMandatory${activeEnvelope}`],
                    fieldValue: value ?? '',
                    fieldValueInWord: value
                        ? convertDigitsToWords(value)
                        : '',
                };
            });

        // 🔹 FILE FIELDS (labelType === '3') → upload separately
        const fileData = list
            .filter(
                (item: any) =>
                    item[`labelType${activeEnvelope}`] === '3'
            )
            .map((item: any) => {
                const seqId =
                    item[`tenderEnvelope${activeEnvelope}SequnceId`];

                return {
                    [`tenderEnvelope${activeEnvelope}SequnceId`]: seqId,
                    [`labelName${activeEnvelope}`]:
                        item[`labelName${activeEnvelope}`],
                    [`labelType${activeEnvelope}`]:
                        item[`labelType${activeEnvelope}`],
                    [`labelMandatory${activeEnvelope}`]:
                        item[`labelMandatory${activeEnvelope}`],
                };
            });

        return payload = {
            deptId: bidData?.deptId,
            tenderId: bidData?.tenderId,


            [`tenderEnvelope${activeEnvelope}NameId`]:
                bidData?.[`tenderEnvelope${activeEnvelope}List`]?.[0]?.[
                `tenderEnvelope${activeEnvelope}NameId`
                ],
            [`envelope${activeEnvelope}TemplateName`]:
                bidData?.[`tenderEnvelope${activeEnvelope}List`]?.[0]?.[
                `envelope${activeEnvelope}TemplateName`
                ],

            [`save${activeEnvelope}Data`]: envelopForm?.[activeEnvelope]?.[3]
                ? fileData
                : saveData,
        };

    };


    const validateEnvelope = () => {
        const list = bidData?.[`tenderEnvelope${activeEnvelope}List`] || [];
        const formValues = envelopForm[activeEnvelope];

        const missing = list.some((item: any) => {
            const seqId = item[`tenderEnvelope${activeEnvelope}SequnceId`];
            const isMandatory = item[`labelMandatory${activeEnvelope}`];
            const value = formValues?.[seqId];

            if (!isMandatory) return false;

            // File upload
            if (item[`labelType${activeEnvelope}`] === '3') {
                return !value;
            }

            // Text / numeric
            return !value || value.toString().trim() === '';
        });

        return !missing;
    };


    const handleSubmitEnvelopeA = async () => {
        if (!validateEnvelope()) {
            Alert.alert('Validation Error', 'Please fill all mandatory fields');
            return;
        }

        const payload = buildEnvelopePayload();
        console.log('Envelope A Payload:', payload);
        setLoading(true)
        if (envelopForm?.[activeEnvelope]?.[3]) {
            handleSubmitEnvelopeFile()
        }
        try {

            const res = await apiCallForPostWithToken(SUBMIT_ENVELOPE_A, payload)
            console.log("res A envelop : ", res)
            ToastAndroid.show(res.message, ToastAndroid.SHORT)


            navigation.goBack()
        } catch (error) {
            console.log("error A envelop submit : ", error)
        } finally {
            setLoading(false)
        }
    };


    const handleSubmitEnvelopeB = async () => {
        if (!validateEnvelope()) {
            Alert.alert('Validation Error', 'Please fill all mandatory fields');
            return;
        }
        setLoading(true)
        const payload = buildEnvelopePayload();
        console.log('Envelope B Payload:', payload);
        if (envelopForm?.[activeEnvelope]?.[3]) {
            handleSubmitEnvelopeFile()
        }
        try {
            const res = await apiCallForPostWithToken(SUBMIT_ENVELOPE_B, payload)
            console.log("res B envelop : ", res)

            ToastAndroid.show(res.message, ToastAndroid.SHORT)
            navigation.goBack()
        } catch (error) {
            console.log("error B envelop submit : ", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmitEnvelopeFile = async () => {

        setLoadingUpload(true)
        const payload = buildEnvelopePayload();
        console.log(`Envelope file ${activeEnvelope}  Payload:`, payload);
        try {
            const formData = new FormData();

            formData.append('files', {
                uri: envelopForm?.[activeEnvelope]?.[3].uri,
                name: envelopForm?.[activeEnvelope]?.[3].name,
                type: envelopForm?.[activeEnvelope]?.[3].type,
            });
            formData.append('requestDto', payload)


            console.log("reuestDto for fil doc : ", formData)
            // return
            const res = await apiCallForPostWithToken(activeEnvelope === 'B' ? SUBMIT_ENVELOPE_B : SUBMIT_ENVELOPE_A, payload)
            console.log(`res file ${activeEnvelope}  Payload:`, res)
            ToastAndroid.show(res.message, ToastAndroid.SHORT)
            // navigation.goBack()
        } catch (error) {
            console.log(`Envelope file  ${activeEnvelope}  error:`, error)
        } finally {
            setLoadingUpload(false)
        }
    }

    if (isLoading) {
        return (
            <>
                <View style={styles.loadingContainer}>
                    <Text>Loading...</Text>
                </View>
            </>
        );
    }

    // console.log("route for date : ", bidData)
    // console.log("bid envelop : ", tenderData)
    return (
        <View style={styles.container}>
            <InsideHeader title="Tender Bidding Start" showArrow />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Tender Info */}
                <View style={styles.card}>
                    <View style={styles.row}>
                        <InfoRow title="Tender Number" value={bidData?.tenderNumber || '-'} />
                        <InfoRow title="NIT Number" value={bidData?.nitNo || '-'} />
                    </View>
                    <View style={styles.row}>
                        <InfoRow title="EMD (in Fig.)" value={bidData?.emdInFig || '-'} />
                        <InfoRow
                            title="Re-Bid Allowed"
                            value={bidData?.tenderRebid ? 'Yes' : 'No'}
                        />
                    </View>
                    <InfoRow title="Bid Withdraw" value={bidData?.bidWithdraw || '-'} />
                </View>

                {/* Envelope Buttons */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Bid Envelopes</Text>
                    <View style={styles.envelopeRow}>
                        {tenderData?.showEA && (
                            <EnvelopeButton
                                title="Envelope A"
                                envelopeType="A"
                                onPress={() => setActiveEnvelope('A')}
                            />
                        )}
                        {tenderData?.showEB && (
                            <EnvelopeButton
                                title="Envelope B"
                                envelopeType="B"
                                onPress={() => {
                                    if (tenderData?.envelopeASubmittStatus) {
                                        setActiveEnvelope('B')
                                    } else {
                                        Alert.alert('Info', 'First Fill Envelop A First')
                                    }
                                }}
                            />
                        )}
                        {tenderData?.showEC && (
                            <EnvelopeButton
                                title="Envelope C"
                                envelopeType="C"
                                onPress={() => setActiveEnvelope('C')}
                            />
                        )}
                    </View>
                </View>
                {/* Envelope A List */}
                {tenderData?.[`tenderEnvelope${activeEnvelope}List`]?.length > 0 && activeEnvelope !== 'C' && (
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Envelope {activeEnvelope} Details</Text>
                        <FlatList
                            data={tenderData?.[`tenderEnvelope${activeEnvelope}List`]}
                            keyExtractor={(item) => item?.[`tenderEnvelope${activeEnvelope}SequnceId`]?.toString()}
                            renderItem={({ item }) => renderEnvelopeItem({ item, envelopeType: activeEnvelope })}
                            scrollEnabled={false}
                        />
                        {/* <View style={[styles.infoRow, { flexDirection: 'row', gap: 10 }]}>
                            <TouchableOpacity onPress={() => setCheck(!check)}>
                                {check ? <Fontisto name="checkbox-active" size={24} color={colors.primary} /> :
                                    <Fontisto name="checkbox-passive" size={24} color={colors.primary} />
                                }</TouchableOpacity>
                            <Text>Check First Terms&Condition</Text>
                        </View> */}
                    </View>
                )}
                <View style={styles.footer}>
                    {hasEnvelopes() ? (
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={() => {
                                if (!check) {
                                    Alert.alert('Info', 'check first terms & condition')
                                }
                                if (activeEnvelope === 'A') {
                                    handleSubmitEnvelopeA()
                                } else {
                                    handleSubmitEnvelopeB()
                                }
                            }}
                        >
                            <Text style={styles.primaryButtonText}>{loading ? 'Submitting...' : `Submit Bid (${activeEnvelope})`}</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => navigation.goBack()}

                        >
                            <Text style={styles.secondaryButtonText}>Go Back</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </View>

    );
};

export default TenderBidding;

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: colors.white
    },
    scrollContainer: {
        padding: 16,
        paddingBottom: '100%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    infoRow: {
        flex: 1,
        marginBottom: 10,
    },
    label: {
        fontSize: 13,
        color: '#777',
        marginBottom: 2,
    },
    value: {
        fontSize: 15,
        color: '#222',
        fontWeight: '500',
    },
    envelopeRow: {
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap',
    },
    envelopeButton: {
        backgroundColor: '#EEF2FF',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    envelopeButtonText: {
        color: '#3F51B5',
        fontWeight: '600',
        fontSize: 14,
    },
    envelopeItem: {
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        backgroundColor: '#f9f9f9',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginVertical: 20,
    },
    primaryButton: {
        backgroundColor: '#3F51B5',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 10,
        minWidth: 120,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
    secondaryButton: {
        borderWidth: 1,
        borderColor: '#EEF2FF',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 10,
        minWidth: 120,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#3F51B5',
        fontWeight: '600',
        fontSize: 15,
    },
});