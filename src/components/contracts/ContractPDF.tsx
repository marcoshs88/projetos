import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Helvetica-Bold',
  src: `https://fonts.gstatic.com/s/opensans/v17/mem5YaGs126MiZpBA-UN7rgOUuhs.ttf`,
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 40,
    lineHeight: 1.4,
    color: '#333',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  companyName: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
  },
  contactInfo: {
    fontSize: 9,
    color: '#555',
  },
  title: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
    marginVertical: 20,
    textDecoration: 'underline',
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    backgroundColor: '#E8E8E8',
    padding: 5,
    marginBottom: 8,
  },
  partyBlock: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  partyItem: {
    width: '50%',
    marginBottom: 3,
  },
  clauseText: {
    textAlign: 'justify',
  },
  listItem: {
    marginLeft: 15,
    textAlign: 'justify',
  },
  signatureSection: {
    marginTop: 40,
    textAlign: 'center',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    width: '60%',
    margin: 'auto',
    marginTop: 40,
    marginBottom: 5,
  },
  footer: {
    textAlign: 'center',
    marginTop: 20,
  }
});

interface ContractPDFProps {
  data: any;
}

export const ContractPDF = ({ data }: ContractPDFProps) => {
  const valorTotal = data.valor_total ? parseFloat(data.valor_total) : 0;
  const valorSinal = data.pagamento_sinal ? parseFloat(data.pagamento_sinal) : 0;
  const valorRestante = valorTotal - valorSinal;

  const formatDate = (dateString: string) => {
    if (!dateString) return '____/____/____';
    return new Date(dateString).toLocaleDate_string('pt-BR', { timeZone: 'UTC' });
  };

  return (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.companyName}>THANARA BAZANELLA</Text>
        <Text style={styles.contactInfo}>Contato: (54) 99626-2340 | Instagram: @thanarabazanella</Text>
      </View>

      <Text style={styles.title}>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PARTES</Text>
        <Text style={{ fontFamily: 'Helvetica-Bold', marginBottom: 4 }}>CONTRATANTE:</Text>
        <View style={styles.partyBlock}>
          <Text style={styles.partyItem}>Nome: {data.cliente || ''}</Text>
          <Text style={styles.partyItem}>CPF: {data.documento || ''}</Text>
          <Text style={styles.partyItem}>Endereço: {data.endereco_cliente || ''}</Text>
          <Text style={styles.partyItem}>Telefone: {data.telefone_cliente || ''}</Text>
        </View>
        
        <Text style={{ fontFamily: 'Helvetica-Bold', marginVertical: 8 }}>CONTRATADA:</Text>
        <View style={styles.partyBlock}>
          <Text style={styles.partyItem}>Nome: Thanara Bazanella</Text>
          <Text style={styles.partyItem}>CNPJ: 53.822.811/0001-00</Text>
          <Text style={styles.partyItem}>Endereço: Rua José Bonifácio, 260, apto 201</Text>
          <Text style={styles.partyItem}>Cidade: Sananduva/RS</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CLÁUSULA 1ª - DO OBJETO DO CONTRATO</Text>
        <Text style={styles.clauseText}>
          O presente instrumento tem por objeto a prestação de serviços de recreação infantil pela CONTRATADA para a CONTRATANTE, a ser realizado conforme as especificações abaixo:
        </Text>
        <Text>Data: {formatDate(data.data)}</Text>
        <Text>Horário: {data.horario_inicio} às {data.horario_termino}</Text>
        <Text>Local do evento: {data.local || ''}</Text>
        <Text>Nome do aniversariante: {data.nome_aniversariante || ''}</Text>
        <Text>Idade a comemorar: {data.idade_aniversariante || ''}</Text>
        <Text>Número aproximado de crianças: {data.numero_criancas || ''}</Text>
        <Text>Monitor(es) responsável(is): {data.monitor || ''}</Text>
        <Text>Serviços inclusos: {data.servico || ''}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CLÁUSULA 2ª - DAS OBRIGAÇÕES DA CONTRATADA</Text>
        <Text style={styles.listItem}>a) Chegar ao local do evento com a antecedência necessária para a organização das atividades.</Text>
        <Text style={styles.listItem}>b) Fornecer todos os materiais necessários para a execução das atividades recreativas contratadas.</Text>
        <Text style={styles.listItem}>c) Zelar pela boa conduta de seus monitores e pela qualidade dos serviços prestados.</Text>
        <Text style={styles.listItem}>d) Supervisionar as crianças durante o período das atividades recreativas, visando sua segurança e bem-estar.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CLÁUSULA 3ª - DAS OBRIGAÇÕES DA CONTRATANTE</Text>
        <Text style={styles.listItem}>a) Disponibilizar um local adequado, seguro e limpo para a realização das atividades.</Text>
        <Text style={styles.listItem}>b) Informar à CONTRATADA sobre qualquer necessidade especial das crianças participantes (alergias, condições médicas, etc.).</Text>
        <Text style={styles.listItem}>c) Responsabilizar-se pelos pertences pessoais das crianças.</Text>
        <Text style={styles.listItem}>d) Caso a duração do evento ultrapasse 4 horas, fornecer alimentação e hidratação para a equipe de monitores.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CLÁUSULA 4ª - DO VALOR E DAS FORMAS DE PAGAMENTO</Text>
        <Text>O valor total dos serviços é de R$ {valorTotal.toFixed(2)}.</Text>
        <Text>O pagamento será realizado da seguinte forma:</Text>
        <Text style={styles.listItem}>- Sinal de R$ {valorSinal.toFixed(2)} para garantia da data, a ser pago via PIX.</Text>
        <Text style={styles.listItem}>- O valor restante de R$ {valorRestante.toFixed(2)} deverá ser pago até o dia do evento.</Text>
        <Text>Chave PIX para pagamento: (54) 99626-2340 (Thanara Bazanella)</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CLÁUSULA 5ª - DA DESISTÊNCIA OU CANCELAMENTO</Text>
        <Text style={styles.clauseText}>
          Em caso de desistência por parte da CONTRATANTE, o valor do sinal não será reembolsado. O cancelamento deve ser informado com no mínimo 15 dias de antecedência. Caso o cancelamento ocorra com menos de 15 dias, será cobrado 50% do valor total do contrato.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CLÁUSULA 6ª - DISPOSIÇÕES GERAIS</Text>
        <Text style={styles.clauseText}>
          A CONTRATADA fica autorizada pela CONTRATANTE a utilizar a imagem do evento (fotos e vídeos) para fins de divulgação em suas redes sociais e material de marketing, {data.uso_imagem_autorizado ? 'conforme autorizado.' : 'exceto quando não autorizado expressamente.'}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text>E, por estarem justas e contratadas, as partes assinam o presente contrato.</Text>
        <Text>Sananduva/RS, {formatDate(new Date().toISOString())}</Text>
      </View>

      <View style={styles.signatureSection}>
        <View style={styles.signatureLine} />
        <Text>{data.cliente}</Text>
        <Text>(CONTRATANTE)</Text>
      </View>

      <View style={styles.signatureSection}>
        <View style={styles.signatureLine} />
        <Text>Thanara Bazanella</Text>
        <Text>(CONTRATADA)</Text>
      </View>
    </Page>
  </Document>
)};