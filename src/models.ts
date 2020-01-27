export class User {
    public id : number;
    public name : string;
    public password : string;
    public email : string;
}

export class Service {
    constructor( protected entity: any, protected entities) {}

    getFullTable() {
        return this.entities.find(this.entity);
    }

    getRow(id) {
        return this.entities.findOne(this.entity, id);
    }

    addRow(rowData) {
        this.entities.save(this.entity, rowData)
        .catch( err => console.log(err))

    }

    async updateRow(rowData, id) {
        let updatedRow = await this.entities.findOne(this.entity, id);
        for (let col in rowData) {
            updatedRow[col] = rowData[col]
        }
        this.entities.save(updatedRow);
    }

    deleteRow(id) {
        this.entities.delete(this.entity, id);
    }
}