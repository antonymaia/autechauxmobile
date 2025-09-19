import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import pageDataService from "../services/pageData";
import textFormatterService from "../services/textFormatter";

export default function Home() {
    const screenWidth = Dimensions.get("window").width;
    const [dataChart, setDataChart] = useState<any[]>([]);
    const [data, setData] = useState({
        totalVendas: 0,
        totalCancelado: 0,
        quantidadeVendas: 0,
        ticketMedio: 0,
        produtosMaisVendidos: [],
        totalVendasPorPagamento: [],
    });
    const router = useRouter();

    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false, // optional
    };

    const handleBuscarDados = async () => {
        try {
            const response = await pageDataService.buscarDadosHome();
            setData(response);

            const cores = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"];

            const chartData = response.totalVendasPorPagamento.map((item: any, index: number) => ({
                name: item.descricao,
                population: item.valor,
                color: cores[index % cores.length],
                legendFontColor: "#333",
                legendFontSize: 14,
            }));

            setDataChart(chartData);
        } catch (error: any) {
            console.log("[Erro ao buscar dados home]", error.response.data);
            router.replace("/login");
        }
    };

    useEffect(() => {
        handleBuscarDados();

        const interval = setInterval(() => {
            handleBuscarDados();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={[styles.titulo, { backgroundColor: "#1f9456ff" }]}>Total Vendas</Text>
                    <Text style={styles.info}>{textFormatterService.formatarNumero(data.totalVendas)}</Text>
                </View>
            </View>
            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={[styles.titulo, { backgroundColor: "#237e4dff" }]}>Qtde Vendas</Text>
                    <Text style={styles.info}>
                        {textFormatterService.formatarNumero(data.quantidadeVendas)}
                    </Text>
                </View>
                <View style={styles.col}>
                    <Text style={[styles.titulo, { backgroundColor: "#226a44ff" }]}>Ticket Médio</Text>
                    <Text style={styles.info}>{textFormatterService.formatarNumero(data.ticketMedio)}</Text>
                </View>
                <View style={styles.col}>
                    <Text style={[styles.titulo, { backgroundColor: "#b6493fff" }]}>T. Cancelado</Text>
                    <Text style={styles.info}>
                        {textFormatterService.formatarNumero(data.totalCancelado)}
                    </Text>
                </View>
            </View>
            <View style={[styles.row, { backgroundColor: "#e9e5e5ff", borderRadius: 5, marginTop: 3 }]}>
                <View style={[styles.col]}>
                    <PieChart
                        data={dataChart}
                        width={screenWidth * 0.46}
                        height={180}
                        chartConfig={chartConfig}
                        accessor={"population"}
                        backgroundColor={"transparent"}
                        paddingLeft={"0"}
                        center={[45, 0]}
                        hasLegend={false}
                        absolute
                    />
                </View>
                <View
                    style={[
                        styles.col,
                        { display: "flex", flexDirection: "column", justifyContent: "space-between" },
                    ]}
                >
                    {dataChart.map((item, index) => (
                        <View key={index} style={styles.legendaItem}>
                            <View style={[styles.legendaCor, { backgroundColor: item.color }]} />
                            <Text style={styles.legendaTexto}>
                                {item.name}: {textFormatterService.formatarNumero(item.population)}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
            <View>
                <Text style={[styles.titulo, { marginTop: 6, backgroundColor: "#265f9bff" }]}>
                    Produtos Mais Vendidos
                </Text>
                <ScrollView>
                    {data.produtosMaisVendidos.map((item: any, index: number) => (
                        <View
                            key={index}
                            style={{
                                backgroundColor: "#e9e5e5ff",
                                padding: 5,
                                borderBottomWidth: 1,
                                borderBottomColor: "#c1c1c1",
                            }}
                        >
                            <Text>{item.codigo}</Text>
                            <Text>{item.descricao}</Text>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <Text>{`Qtde ${item.quantidade}`}</Text>
                                <Text>{item.valorTotal}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 450,
    },
    infoWrapper: {
        borderColor: "#131313",
        borderWidth: 1,
    },
    row: {
        flexDirection: "row",
    },
    col: {
        flex: 1, // cada coluna ocupa metade do espaço
        margin: 3,
    },
    titulo: {
        padding: 10,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        fontSize: 16,
        color: "#f1f1f1",
    },
    info: {
        padding: 10,
        textAlign: "center",
        fontSize: 18,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: "#e9e5e5ff",
    },
    legendaItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    legendaCor: {
        width: 16,
        height: 16,
        marginRight: 8,
        borderRadius: 4,
    },
    legendaTexto: {
        fontSize: 16,
        color: "#333",
        flexShrink: 1,
        maxWidth: "95%",
    },
});
