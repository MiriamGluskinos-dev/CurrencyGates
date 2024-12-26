export class SystemTable {


    public ID: string;
    public MalamId: string;
    public Name: string;
    public State: string;
    public ExtraStringData: string;

    constructor
        (
            ID: string,
            MalamId: string,
            Name: string,
            State: string,
            ExtraStringData: string
        ) {
        this.ID = ID;
        this.MalamId = MalamId;
        this.Name = Name;
        this.State = State;
        this.ExtraStringData = ExtraStringData;
    }

   
  get displayText(): string {

        // if (this.currencyTypeID == undefined)
        //     return this.currencyTypeName;

        return ` ${this.ID} - ${this.ExtraStringData} `;
    }
}





export class SystemTableNameField {


    public field: string;
    public header: string;
    constructor
        (field: string,
            header: string, ) {
        this.field = field;
        this.header = header;

    }

  
}  