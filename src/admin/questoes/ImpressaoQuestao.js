import React, { Component } from "react"
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

// Create styles
const styles = StyleSheet.create({
        page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});


class ImpessaoQuestao extends Component {
    state = {

    }

    render(){
        return(
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                        <Text>Section #1</Text>
                    </View>
                    <View style={styles.section}>
                        <Text>Section #2</Text>
                    </View>
                </Page>
            </Document>
        )        
    }
}
 

export default ImpessaoQuestao
//ReactDOM.render(<ImpessaoQuestao />, document.getElementById('root'));
//ReactPDF.render(<ImpessaoQuestao />, `/example.pdf`);