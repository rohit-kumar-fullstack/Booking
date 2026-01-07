import React, { useState } from 'react'
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { pick } from '@react-native-documents/picker'
import { useSelector } from 'react-redux'
import { apiCall } from '../../../Axios/Axios'
import { TECHNICAL_DOCUMENT_SUBMIT, TECHNICAL_VALUE_SUBMIT } from '../../../Services/BBPS/ApiUrls'
import { Props } from '../Type/BidType'
import colors from '../../../Constant/Color'
import { Loader } from '../../../Component/Index'
import { useNavigation } from '@react-navigation/native'
import NavigationString from '../../../Constant/NavigationString'

const TemplateFormModal: React.FC<Props> = ({ visible, template, setAllBoolean }) => {
    if (!template) return null

    const SelectedAuction = useSelector((state: any) => state.auction.auction)
    const Navigation: any = useNavigation()
    const [loading, setLoading] = useState(false)
    const initialValues = template.labels.reduce((acc: any, label: any) => {
        acc[label.labelName] = ''
        return acc
    }, {})

    const validationSchema = Yup.object(
        template.labels.reduce((acc: any, label: any) => {
            if (label.mandatory) {
                acc[label.labelName] =
                    label.labelType === '3'
                        ? Yup.mixed().required(`${label.labelName} is required`)
                        : Yup.string().required(`${label.labelName} is required`)
            }
            return acc
        }, {})
    )

    const pickFile = async (fieldName: string, setFieldValue: any) => {
        try {
            const result = await pick({
                type: ['application/pdf'],
                allowMultiSelection: false,
            })
            const file = result[0]
            setFieldValue(fieldName, {
                name: file.name ?? 'document.pdf',
                uri: file.uri,
                type: 'application/pdf',
                size: file.size,
            })
        } catch (e) {
            console.log(e)
        }
    }

    const renderInput = (
        label: any,
        value: any,
        setFieldValue: any,
        error?: string,
        touched?: boolean
    ) => {
        const showError = touched && error

        if (label.labelType === '3') {
            return (
                <View key={label.labelName} style={styles.field}>
                    <Text style={styles.label}>
                        {label.labelName}
                        {label.mandatory && <Text style={styles.required}> *</Text>}
                    </Text>

                    <TouchableOpacity
                        style={[
                            styles.filePicker,
                            showError && styles.errorBorder,
                        ]}
                        onPress={() =>
                            pickFile(label.labelName, setFieldValue)
                        }
                    >
                        <Text
                            style={[
                                styles.fileText,
                                value?.name && styles.fileSelected,
                            ]}
                        >
                            {value?.name || 'Upload PDF'}
                        </Text>
                    </TouchableOpacity>

                    {showError && (
                        <Text style={styles.errorText}>{error}</Text>
                    )}
                </View>
            )
        }

        return (
            <View key={label.labelName} style={styles.field}>
                <Text style={styles.label}>
                    {label.labelName}
                    {label.mandatory && <Text style={styles.required}> *</Text>}
                </Text>

                <TextInput
                    style={[
                        styles.input,
                        showError && styles.errorBorder,
                    ]}
                    placeholder={`Enter ${label.labelName}`}
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={(text) =>
                        setFieldValue(label.labelName, text)
                    }
                    keyboardType={
                        label.labelType === '1' || label.labelType === '4'
                            ? 'numeric'
                            : 'default'
                    }
                />

                {showError && (
                    <Text style={styles.errorText}>{error}</Text>
                )}
            </View>
        )
    }

    const onClose = () => {
        setAllBoolean((prev: any) => ({
            ...prev,
            technicalDocModalVisible: false,
        }))
    }

    const onSubmit = async (payload: any) => {
        try {
            const jsonBody = {
                auctiontId: SelectedAuction.auctionId,
                technicalDocumentTemplateId: payload.templateNameId,
                labelValues: [] as any[],
            }

            const fileFormData = new FormData()
            let hasFile = false

            Object.entries(payload.values).forEach(
                ([labelName, labelValue]: any) => {
                    if (typeof labelValue === 'object' && labelValue?.uri) {
                        hasFile = true
                        fileFormData.append(labelName, {
                            uri: labelValue.uri,
                            name: labelValue.name,
                            type: labelValue.type,
                        } as any)
                    } else {
                        jsonBody.labelValues.push({
                            labelName,
                            labelValue: String(labelValue),
                        })
                    }
                }
            )

            const rs1: any = await apiCall('post', TECHNICAL_VALUE_SUBMIT, jsonBody)


            if (hasFile) {
                fileFormData.append(
                    'auctiontId',
                    String(SelectedAuction.auctionId)
                )
                fileFormData.append(
                    'technicalDocumentTemplateId',
                    String(payload.templateNameId)
                )

                const res2: any = await apiCall(
                    'post',
                    TECHNICAL_DOCUMENT_SUBMIT,
                    fileFormData,
                    {},
                    'multipart/form-data'
                )
                console.log(res2, '-------------res2');
                if (rs1.statusCode == 200 && res2.statusCode == 200) {
                    Navigation.navigate(NavigationString.StartBidding)
                    setAllBoolean((prev: any) => ({ ...prev, technicalDocModalVisible: false }))

                }

            } else {
                if (rs1.statusCode == 200) {
                    Navigation.navigate(NavigationString.StartBidding)
                    setAllBoolean((prev: any) => ({ ...prev, technicalDocModalVisible: false }))
                }
            }

        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View style={styles.screen}>

                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.headerTitle}>Technical Documents</Text>
                        <Text style={styles.headerSubtitle}>
                            Fill the form, Click save when you're done.
                        </Text>
                    </View>

                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content}>

                    <View style={styles.card}>
                        <Text style={styles.templateHeading}>Template</Text>

                        <View style={styles.templateBox}>
                            <Text style={styles.templateName}>
                                {template.templateName}
                            </Text>

                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={(values) => {
                                    setLoading(true)
                                    onSubmit({
                                        templateNameId: template.templateNameId,
                                        auctionIds: template.auctionIds,
                                        values,
                                    })
                                }}
                            >
                                {({ handleSubmit, values, errors, touched, setFieldValue }) => (
                                    <>
                                        {template.labels.map((label: any) =>
                                            renderInput(
                                                label,
                                                values[label.labelName],
                                                setFieldValue,
                                                // errors[label.labelName],
                                                // touched[label.labelName]
                                            )
                                        )}

                                        <View style={styles.submitRow}>
                                            <TouchableOpacity
                                                style={styles.submitBtn}
                                                onPress={() => handleSubmit()}
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <Loader
                                                        size="small"
                                                        color={colors.white}
                                                    />
                                                ) : (
                                                    <Text style={styles.submitText}>
                                                        Submit
                                                    </Text>
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                )}
                            </Formik>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    )

}

export default TemplateFormModal

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    headerLeft: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    closeBtn: {
        padding: 6,
    },
    closeText: {
        fontSize: 18,
        color: '#6B7280',
    },
    content: {
        paddingHorizontal: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E5E7EB',
        paddingVertical: 20
    },
    templateHeading: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 16,
        color: '#111827',
    },

    templateBox: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        padding: 16,
    },
    templateName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
    },
    field: {
        marginBottom: 14,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 6,
    },
    required: {
        color: '#EF4444',
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: '#111827',
    },
    filePicker: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
    },
    fileText: {
        color: '#6B7280',
        fontSize: 14,
    },
    fileSelected: {
        color: '#111827',
        fontWeight: '600',
    },
    errorText: {
        color: '#EF4444',
        fontSize: 12,
        marginTop: 4,
    },
    errorBorder: {
        borderColor: '#EF4444',
    },
    submitRow: {
        marginTop: 20,
        alignItems: 'flex-end',
        height:50
    },
    submitBtn: {
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 22,
        borderRadius: 8,
        minWidth: 120,
        alignItems: 'center',
    },
    submitText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },
})

