import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Registrar fontes (opcional, mas bom para consistência)
// Font.register({
//   family: 'Roboto',
//   src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf'
// });

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    paddingBottom: 30,
    lineHeight: 1.5,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
    padding: 4,
  },
  text: {
    marginBottom: 5,
  },
  signatureSection: {
    marginTop: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  signature: {
    width: '40%',
    textAlign: 'center',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginTop: 40,
  },
});

interface ContractPDFProps {
  data: any;
}

export const ContractPDF = ({ data }: ContractPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CONTRATANTE</Text>
        <Text style={styles.text}>Nome: {data.cliente || '____________________'}</Text>
        <Text style={styles.text}>CPF/CNPJ: {data.documento || '____________________'}</Text>
        <Text style={styles.text}>Endereço: {data.endereco || '____________________'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CONTRATADA</Text>
        <Text style={styles.text}>Nome: [Seu Nome/Nome da Empresa]</Text>
        <Text style={styles.text}>CNPJ: [Seu CNPJ]</Text>
        <Text style={styles.text}>Endereço: [Seu Endereço]</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CLÁUSULA 1ª - DO OBJETO</Text>
        <Text style={styles.text}>
          O presente contrato tem por objeto a prestação de serviços de entretenimento para o evento a ser realizado nas seguintes condições:
        </Text>
        <Text style={styles.text}>Data do Evento: {data.data ? new Date(data.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '____/____/____'}</Text>
        <Text style={styles.text}>Horário: {data.horario || '____:____'}</Text>
        <Text style={styles.text}>Local: {data.local || '____________________'}</Text>
        <Text style={styles.text}>Serviços Contratados: {data.servico || '____________________'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CLÁUSULA 2ª - DO VALOR E FORMA DE PAGAMENTO</Text>
        <Text style={styles.text}>
          Pelos serviços prestados, a CONTRATANTE pagará à CONTRATADA o valor total de R$ {data.valor_total ? parseFloat(data.valor_total).toFixed(2) : '0.00'}.
        </Text>
        <Text style={styles.text}>
          O pagamento será efetuado da seguinte forma: [Descrever forma de pagamento, ex: 50% de sinal e 50% no dia do evento].
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CLÁUSULA 3ª - DAS OBRIGAÇÕES</Text>
        <Text style={styles.text}>
          A CONTRATADA se compromete a fornecer os serviços descritos na Cláusula 1ª com a devida qualidade e pontualidade. A CONTRATANTE se compromete a fornecer as condições necessárias para a execução dos serviços no local do evento.
        </Text>
      </View>

      <View style={styles.signatureSection}>
        <View style={styles.signature}>
          <View style={styles.signatureLine} />
          <Text>{data.cliente || 'CONTRATANTE'}</Text>
        </View>
        <View style={styles.signature}>
          <View style={styles.signatureLine} />
          <Text>CONTRATADA</Text>
        </View>
      </View>
    </Page>
  </Document>
);