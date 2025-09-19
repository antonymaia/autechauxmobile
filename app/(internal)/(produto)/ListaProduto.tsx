import produtoService from "@/app/services/produtoService";
import ItemPaginaProduto from "@/app/types/ItemPaginaProduto";
import Pagina from "@/app/types/Pagina";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const options = [
    { value: 1, text: "Código" },
    { value: 2, text: "C. Barras" },
    { value: 3, text: "Contendo" },
    { value: 4, text: "Comecando" },
    { value: 5, text: "Inat. Comecando" },
];

export default function ListaProduto() {
    const [codBusca, setCodBusca] = useState(3);
    const [textoBusca, setTextoBusca] = useState("");
    const [pagina, setPagina] = useState<Pagina<ItemPaginaProduto>>();
    const [carregando, setCarregando] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState(0);

    const inicializado = useRef(false);

    const buscarPaginaProduto = async () => {
        setCarregando(true);
        setPagina(await produtoService.buscarPaginaProduto(codBusca, textoBusca, paginaAtual, 200));
        setCarregando(false);
    };

    useEffect(() => {
        if (inicializado.current) {
            buscarPaginaProduto();
        } else {
            inicializado.current = true;
        }
    }, [paginaAtual]);

    return (
        <View style={styles.container}>
            <View style={styles.pickerWrapper}>
                <Picker
                    dropdownIconColor={"#000"}
                    style={{ color: "#000", fontSize: 12 }}
                    mode="dropdown"
                    selectedValue={codBusca}
                    onValueChange={(itemValue, itemIndex) => setCodBusca(itemValue)}
                >
                    {options.map((option) => {
                        return (
                            <Picker.Item
                                key={option.value}
                                label={option.text}
                                value={option.value}
                                style={{ fontSize: 14 }}
                            />
                        );
                    })}
                </Picker>
            </View>
            <View style={styles.row}>
                <TextInput style={styles.input} value={textoBusca} onChangeText={setTextoBusca} />
                <TouchableOpacity style={styles.button} onPress={buscarPaginaProduto} disabled={carregando}>
                    <Text style={styles.textButton}>Buscar</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1, marginTop: 10 }}>
                {pagina?.content.map((item, index) => {
                    return (
                        <View key={index} style={styles.itemWrapper}>
                            <View style={styles.row}>
                                <Text>{item.codigo}</Text>
                                <Text>{item.codigoBarras}</Text>
                            </View>
                            <View>
                                <Text>{item.descricao}</Text>
                            </View>
                            <View style={[styles.row, { justifyContent: "space-between" }]}>
                                <Text>{`Qtde: ${item.quantidade || 0}`}</Text>
                                <Text>{`P. Custo: ${item.precoCusto || 0.0}`}</Text>
                                <Text>{`P. Venda: ${item.precoVenda}`}</Text>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
            <View
                style={[
                    styles.row,
                    { justifyContent: "space-between", alignItems: "center", marginTop: 5, marginBottom: 5 },
                ]}
            >
                <Text style={{ fontSize: 16 }}>{`Paginas: ${pagina?.totalPages || 0}`}</Text>
                <View style={styles.row}>
                    <TouchableOpacity
                        onPress={() => setPaginaAtual(paginaAtual - 1)}
                        style={styles.navibutton}
                        disabled={pagina?.first || carregando}
                    >
                        <MaterialIcons name="keyboard-arrow-left" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.pageNumber}>{(pagina?.number || 0) + 1}</Text>
                    <TouchableOpacity
                        onPress={() => setPaginaAtual(paginaAtual + 1)}
                        style={styles.navibutton}
                        disabled={pagina?.last || carregando}
                    >
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <Text style={{ fontSize: 16 }}>{`Itens: ${pagina?.totalElements || 0}`}</Text>
            </View>
            {carregando && (
                <View style={styles.wrapperSpinner}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "white",
    },
    row: {
        flexDirection: "row",
    },
    pickerWrapper: {
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: "#f4f4f4ff",
    },
    input: {
        flex: 1,
        borderRadius: 5,
        marginRight: 10,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingTop: 5,
        backgroundColor: "#f4f4f4ff",
        color: "#000",
    },
    button: {
        borderRadius: 5,
        backgroundColor: "#2b5491ff",
        color: "white",
        padding: 10,
    },
    textButton: {
        color: "white",
    },
    itemWrapper: {
        backgroundColor: "#e9e9e9ff",
        marginBottom: 5,
        padding: 8,
        borderRadius: 5,
    },
    wrapperSpinner: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#04040456",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    navibutton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#2b5491ff",
    },
    pageNumber: {
        textAlignVertical: "center",
        paddingLeft: 20,
        paddingRight: 20,
        fontSize: 20,
    },
});
