/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const xml2js = require('xml2js');

const parser = new xml2js.Parser();

fs.readFile(__dirname + '/data.xml', function (err, data) {
    if (err) {
        console.error(err);
        return;
    }

    parser.parseString(data, function (err, result) {
        if (err) {
            console.error(err);
            return;
        }

        const json = JSON.stringify(result, null, 2);
        // console.log(json)
        const abn = result.root.ABR.map(item => ({
            abn: item.ABN[0]._,
            abn_status: item.ABN[0].$.status,
            company_name: item.MainEntity[0].NonIndividualName[0].NonIndividualNameText[0],
            company_type: item.EntityType[0].EntityTypeInd[0],
            gst_status: item.GST ? item.GST[0].$.status : 'N/A',
            postcode: item.MainEntity[0].BusinessAddress[0].AddressDetails[0].Postcode ? parseInt(item.MainEntity[0].BusinessAddress[0].AddressDetails[0].Postcode[0]) : null,
            state: item.MainEntity[0].BusinessAddress[0].AddressDetails[0].State ? item.MainEntity[0].BusinessAddress[0].AddressDetails[0].State[0] : 'N/A',
        }));

        // write a csv file for this json
        const csv = abn.map(item => `${item.abn},"${item.company_name}",${item.company_type},${item.abn_status},${item.gst_status},${item.postcode},${item.state}`).join('\n');
        fs.writeFile(__dirname + '/output.csv', 'abn,company_name,company_type,abn_status,gst_status,postcode,state\n' + csv, function (err) {
            if (err) {
                console.error(err);
                return;
            }
            console.log('CSV file has been saved.');
        });

    });

});
