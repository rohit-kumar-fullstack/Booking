import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { pick } from '@react-native-documents/picker';
import Animated, { FadeInDown, FadeOutUp, Layout } from 'react-native-reanimated';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { InsideHeader, Loader, Skelton } from '../../Component/Index';
import colors from '../../Constant/Color';
import EmdComplete from './Component/EmdComplete';
import NavigationString from '../../Constant/NavigationString';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useAuctionItem, useEmdCheck } from '../../Services/BBPS/Hooks';
import { apiCall } from '../../Axios/Axios';
import { AUCTION_ITEM_SUBMIT, CHECK_TECHNICAL_DOCUMENTAION, GET_TECHNICAL_DOCUMENTAION } from '../../Services/BBPS/ApiUrls';
import TemplateFormModal from './Component/TemplateFormModal';
import { SelectedItem } from './Type/BidType';


const Emd = () => {
    const Navigation: any = useNavigation()
    const SelectedAuction = useSelector((state: any) => state.auction.auction)
    const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
    const [acceptedPolicy, setAcceptedPolicy] = useState(false);
    const [allBoolean, setAllBoolean] = useState({ isSubmitEmdLoading: false, isEmdComplete: false, auctionItems: [], technicalDocumentStatus: false, selectTemplate: {}, technicalDocModalVisible: false })
    const { mutate } = useEmdCheck()
    const { mutate: AuctionItemMutate, isPending } = useAuctionItem()

    const isSelected = (id: number) => selectedItems.some(i => i.auctionItemId === id);

    const toggleSelect = (item: any, checked: boolean) => {
        if (!checked) {
            setSelectedItems(prev =>
                prev.filter(i => i.auctionItemId !== item.id),
            );
        } else {
            setSelectedItems(prev => [
                ...prev,
                { auctionItemId: item.id, productImageName: '', file: null },
            ]);
        }
    };

    const updateSelectedItem = (id: number, data: Partial<SelectedItem>) => {
        setSelectedItems(prev =>
            prev.map(i => (i.auctionItemId === id ? { ...i, ...data } : i)),
        );
    };

    const pickFile = async (id: number) => {
        try {
            const res = await pick({ type: ['application/pdf'] });
            const file = res[0];
            updateSelectedItem(id, {
                file: {
                    name: file.name ?? 'document.pdf',
                    uri: file.uri,
                    type: 'application/pdf',
                },
            });
        } catch {
            console.log('Pick cancelled');
        }
    };



    /* ---------------- Render Item ---------------- */
    const renderItem = ({ item }: any) => {
        const selected = isSelected(item.id);
        const selectedData = selectedItems.find(
            i => i.auctionItemId === item.id,
        );

        return (
            <Animated.View
                layout={Layout.springify()}
                entering={FadeInDown}
                style={[styles.card, selected && styles.cardSelected]}
            >
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={styles.title}>{item.productName}</Text>
                        <Text style={styles.subText}>EMD ₹ {item.emdAmount}</Text>
                    </View>

                    <BouncyCheckbox
                        size={20}
                        fillColor={colors.primary}
                        iconStyle={{ borderRadius: 5, borderWidth: 1.5, borderColor: colors.primary }}
                        innerIconStyle={{ borderRadius: 6 }}
                        isChecked={selected}
                        onPress={(checked) => toggleSelect(item, checked)}
                    />
                </View>

                <Text style={styles.meta}>
                    Existing Doc:{' '}
                    <Text style={styles.bold}>
                        {item.itemDocumentName ?? 'Not Uploaded'}
                    </Text>
                </Text>

                {selected && (
                    <Animated.View
                        entering={FadeInDown}
                        exiting={FadeOutUp}
                        style={styles.form}
                    >
                        <TextInput
                            placeholder="Document name"
                            value={selectedData?.productImageName}
                            onChangeText={text =>
                                updateSelectedItem(item.id, { productImageName: text })
                            }
                            style={styles.input}
                            placeholderTextColor={colors.lightText}
                        />

                        <TouchableOpacity
                            style={styles.uploadBtn}
                            onPress={() => pickFile(item.id)}
                        >
                            <Text style={styles.uploadText}>
                                {selectedData?.file ? 'Change PDF' : 'Upload PDF'}
                            </Text>
                        </TouchableOpacity>

                        {selectedData?.file && (
                            <Text style={styles.fileName}>
                                {selectedData.file.name}
                            </Text>
                        )}
                    </Animated.View>
                )}
            </Animated.View>
        );
    };

    // Api calls
    const getAuctionItem = async () => {
        try {
            setAllBoolean((prev: any) => ({ ...prev, isLoading: true }))
            if (SelectedAuction.auctionPattern === 'Forward') {
                const payload = { auctionNumber: SelectedAuction.auctionNumber, status: 'Forward' }
                AuctionItemMutate(payload, {
                    onSuccess: (res) => {
                        if (res.statusCode == 200) {
                            setAllBoolean((prev: any) => ({ ...prev, auctionItems: Array.isArray(res?.data) ? res.data : [res.data] }))
                        }
                    },
                    onError: (err) => {

                    }
                })

            } else if (SelectedAuction.auctionPattern === 'Reverse') {
                const payload = { auctionNumber: SelectedAuction.auctionNumber, status: 'Reverse' }
                AuctionItemMutate(payload, {
                    onSuccess: (res) => {
                        if (res.statusCode == 200) {
                            setAllBoolean((prev: any) => ({ ...prev, auctionItems: Array.isArray(res?.data) ? res.data : [res.data] }))
                        }
                    },
                    onError: (err) => {

                    }
                })

            }
        } catch (error) {
            console.log('Auction fetch error', error)
        } finally {
            setAllBoolean((prev: any) => ({ ...prev, isLoading: false }))
        }
    }

    const getTemplateDocumentation = async () => {
        try {
            if (SelectedAuction.technicalDocReq) {
                const res = await apiCall<any>('get', CHECK_TECHNICAL_DOCUMENTAION, {}, { auctionId: SelectedAuction.auctionId })

                if (res.data) {
                    setAllBoolean((prev: any) => ({ ...prev, technicalDocumentStatus: true }))
                } else {
                    const res = await apiCall<any>('get', GET_TECHNICAL_DOCUMENTAION,)
                    const auctionIdToFind = String(SelectedAuction.auctionId);
                    const matchedObject = res.data.find((item: any) =>
                        item.auctionIds
                            .split(',')
                            .map((id: any) => id.trim())
                            .includes(auctionIdToFind)
                    );
                    setAllBoolean((prev: any) => ({ ...prev, selectTemplate: matchedObject, technicalDocModalVisible: true }))
                }
            }


        } catch (error) {
            console.log('Auction fetch error', error)
        } finally {
            setAllBoolean((prev: any) => ({ ...prev, isLoading: false }))
        }
    }

    const AlreadyEmdCheck = async () => {
        try {
            mutate({ auctionNumber: SelectedAuction.auctionNumber }, {
                onSuccess: (res => {
                    console.log(SelectedAuction.auctionNumber, res , SelectedAuction,'iiiiiiiiiiiiiiiiiiiiiiiii');
                    
                    if (res.statusCode == 200) {
                        if (res.message == 'No EMD Documents') {
                            setAllBoolean((prev: any) => ({ ...prev, isEmdComplete: false }))
                            getAuctionItem()
                        } else {
                            if (!SelectedAuction.technicalDocReq) {
                                setAllBoolean((prev: any) => ({ ...prev, isEmdComplete: true, technicalDocumentStatus: true }))
                            } else {
                                setAllBoolean((prev: any) => ({ ...prev, isEmdComplete: true }))
                                getTemplateDocumentation()
                            }

                        }
                    }
                }),
                onError: (err) => {

                }
            })
        } catch (error) {
            console.log('EMD Check Error:', error)
        } finally {
            setAllBoolean((prev: any) => ({ ...prev, isLoading: false }))
        }
    }

    const handleSubmit = async () => {
        setAllBoolean((prev: any) => ({ ...prev, isSubmitEmdLoading: true }))
        if (!acceptedPolicy) {
            Alert.alert('Policy Required', 'Please accept terms');
            return;
        }

        if (selectedItems.length === 0) {
            Alert.alert('Select Item', 'Please select at least one item');
            return;
        }

        for (const item of selectedItems) {
            if (!item.productImageName || !item.file) {
                Alert.alert('Incomplete', 'Upload documents for all selected items');
                return;
            }
        }
        try {
            const formData = new FormData()

            formData.append('auctionId', String(SelectedAuction.auctionId))

            selectedItems.forEach((item: any) => {
                formData.append(
                    'auctionItemId',
                    String(item.auctionItemId)
                )

                formData.append(
                    'productImageName',
                    item.productImageName
                )

                formData.append('files', {
                    uri: item.file.uri,
                    name: item.file.name,
                    type: item.file.type || 'application/pdf',
                } as any)
            })

            const res = await apiCall<any>('post', AUCTION_ITEM_SUBMIT, formData, {}, 'multipart/form-data')
            if (res.statusCode == 200) {
                if (SelectedAuction.technicalDocReq) {
                    getTemplateDocumentation()
                } else {
                    if (SelectedAuction.auctionPattern === 'Forward') {
                        Navigation.navigate(NavigationString.StartBidding)
                    } else {
                        Navigation.navigate(NavigationString.StartReverseBidding)
                    }
                }
            }
        } catch (error) {
            console.log('Submit error', error)
            Alert.alert('Error', 'Failed to submit EMD')
        } finally {
            setAllBoolean((prev: any) => ({ ...prev, isSubmitEmdLoading: true }))
        }
    };

    const EmdContinueHandle = async () => {

        if (allBoolean.technicalDocumentStatus) {
            if (SelectedAuction.auctionPattern === 'Forward') {
                Navigation.navigate(NavigationString.StartBidding)
            } else {
                Navigation.navigate(NavigationString.StartReverseBidding)
            }
        } else {
            getTemplateDocumentation()
        }
    }
    useEffect(() => {
        AlreadyEmdCheck()
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            <InsideHeader title="EMD Submission" showArrow />
            <View style={styles.container}>
                {SelectedAuction.technicalDocReq && allBoolean.technicalDocModalVisible &&
                    <TemplateFormModal visible={allBoolean.technicalDocModalVisible} allBoolean={allBoolean} setAllBoolean={setAllBoolean} template={allBoolean.selectTemplate} />
                }

                {isPending ? (
                    <Skelton />
                ) : allBoolean.isEmdComplete ? (
                    <EmdComplete onNext={EmdContinueHandle} />
                ) : <>
                    <FlatList
                        data={allBoolean.auctionItems}
                        keyExtractor={(item: any) => item.auctionId}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingBottom: 170 }}
                    />

                    <View style={styles.bottom}>
                        <BouncyCheckbox
                            size={18}
                            fillColor={colors.primary}
                            iconStyle={{ borderRadius: 5, borderWidth: 1.5, borderColor: colors.primary }}
                            innerIconStyle={{ borderRadius: 5 }}
                            isChecked={acceptedPolicy}
                            onPress={() => setAcceptedPolicy(p => !p)}
                            text="I agree to Terms & Privacy Policy"
                            textStyle={styles.policyText}
                        />

                        <TouchableOpacity
                            style={[
                                styles.submitBtn,
                                !acceptedPolicy && styles.disabled,
                            ]}
                            onPress={handleSubmit}
                            disabled={!acceptedPolicy}
                        >
                            {
                                allBoolean.isSubmitEmdLoading ? <Loader size='small' color={colors.white} /> : <Text style={styles.submitText}>Submit EMD</Text>
                            }

                        </TouchableOpacity>
                    </View>
                </>
                }
            </View>
        </View>
    );
};

export default Emd;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10
    },

    card: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 5,
        marginTop: 16,
        padding: 18,
        borderRadius: 8,
        elevation: 5,
        overflow: 'hidden'
    },

    cardSelected: {
        backgroundColor: colors.primaryHighlight,
        borderWidth: 1.5,
        borderColor: colors.primary,
    },

    cardHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    title: {
        fontSize: 17,
        fontWeight: '800',
        color: '#0F172A',
    },

    subText: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 6,
    },

    meta: {
        marginTop: 10,
        fontSize: 13,
        color: '#475569',
    },

    bold: {
        fontWeight: '700',
        color: '#020617',
    },

    form: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderColor: '#E2E8F0',
    },

    input: {
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 14,
        padding: 12,
        backgroundColor: '#FFFFFF',
        fontSize: 14,
        color: colors.black
    },

    uploadBtn: {
        marginTop: 12,
        backgroundColor: colors.primary,
        paddingVertical: 13,
        borderRadius: 14,
        alignItems: 'center',
        shadowColor: colors.primaryHighlight,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 4,
    },

    uploadText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 14,
    },

    fileName: {
        marginTop: 8,
        fontSize: 12,
        color: '#475569',
    },

    bottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderColor: '#E2E8F0',

        shadowColor: '#000',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.08,
        shadowRadius: 14,
        elevation: 12,
    },

    policyText: {
        fontSize: 13,
        color: '#334155',
    },

    submitBtn: {
        marginTop: 14,
        backgroundColor: colors.primary,
        paddingVertical: 15,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: colors.primaryHighlight,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.32,
        shadowRadius: 16,
        elevation: 6,
    },

    disabled: {
        backgroundColor: colors.lightText
    },

    submitText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 15,
    },
});
