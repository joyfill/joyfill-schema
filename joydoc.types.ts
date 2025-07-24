//Version: 1.0.2 (July 14th 2025)

// Top-level Template interface
export interface Template {
  _id?: string;
  type?: 'template' | 'document';
  stage?: string;
  metadata?: Record<string, any>;
  identifier?: string;
  name?: string;
  createdOn?: number;
  files: TemplateFile[];
  fields: Field[];
  deleted?: boolean;
  categories?: string[];
  formulas?: Formula[];
  [key: string]: any;
}

export interface Formula {
  _id: string,
  desc: string,
  type: 'calc', //Future will have logic, validation, etc.
  scope: 'global' | 'private',
  expression: string,
  [key: string]: any;
}

// -----------------------------
// File, Page, and View Definitions
// -----------------------------

export interface TemplateFile {
  _id: string;
  metadata?: Record<string, any>;
  name: string;
  styles: CoreStyles;
  pages: Page[];
  pageOrder: string[];
  views?: View[];
  [key: string]: any;
}

export interface View {
  type?: 'mobile';
  pageOrder: string[];
  pages: Page[];
  [key: string]: any;
}

export interface Page {
  _id: string;
  name: string;
  fieldPositions: FieldPosition[];
  metadata?: Record<string, any>;
  hidden?: boolean;
  width: number;
  height: number;
  cols: number;
  rowHeight: number;
  layout: string;
  presentation: string;
  margin?: number;
  padding?: number;
  borderWidth?: number;
  backgroundImage?: string;
  backgroundSize?: '' | '100% 100%';
  logic?: Logic;
  [key: string]: any;
}

export interface FieldPosition extends CoreStyles {
  _id: string;
  field: string;
  displayType: FieldPositionDisplayType; 
  width: number;
  height: number;
  x: number;
  y: number;
  type: FieldType; 

  // Optional properties – present only for some types:
  schema?: {
    [schemaId: string]: {
      [key: string]: any;
      tableColumns?: {
        [columnId: string]: {
          format?: string;
          hidden?: boolean;
          [key: string]: any;
        };
      }  
    }
  }
  tableColumns?: {
    [columnId: string]: {
      format?: string;
      hidden?: boolean;
      [key: string]: any;
    };
  };
  primaryMaxWidth?: number;
  primaryMaxHeight?: number;
  format?: string;
  targetValue?: string;
  lineHeight?: number;
  zIndex?: number;
  columnTitleFontSize?: number;
  columnTitleFontColor?: string;
  columnTitleFontStyle?: 'normal' | 'italic';
  columnTitleFontWeight?: string;
  columnTitleTextAlign?: 'left' | 'center' | 'right';
  columnTitleTextTransform?: 'none' | 'uppercase';
  columnTitleTextDecoration?: 'none' | 'underline';
  columnTitleBackgroundColor?: string;
  columnTitlePadding?: number;
  titleDisplay?: 'none' | 'inline';
  rowIndex?: number;
  column?: string;
  columnType?: string;
  [key: string]: any;
}

export type FieldPositionDisplayType =
  | 'original'
  | 'horizontal'
  | 'text'
  | 'circle'
  | 'square'
  | 'check'
  | 'radio'
  | 'inputGroup';


  type KnownFieldType =
  | 'image'
  | 'richText'
  | 'file'
  | 'text'
  | 'textarea'
  | 'number'
  | 'dropdown'
  | 'multiSelect'
  | 'date'
  | 'signature'
  | 'table'
  | 'chart'
  | 'collection'
  | 'block'
  | 'rte';

export type FieldType = KnownFieldType | string;

// -----------------------------
// Core Styles
// -----------------------------

export interface CoreStyles {
  titleFontSize?: number;
  titleFontColor?: string;
  titleFontStyle?: 'normal' | 'italic';
  titleFontWeight?: string;
  titleTextAlign?: 'left' | 'center' | 'right';
  titleTextTransform?: 'none' | 'uppercase';
  titleTextDecoration?: 'none' | 'underline';
  fontSize?: number;
  fontStyle?: 'normal' | 'italic';
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  textTransform?: 'none' | 'uppercase';
  textDecoration?: 'none' | 'underline';
  textOverflow?: '' | 'ellipsis';
  padding?: number;
  margin?: number;
  borderColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  backgroundColor?: string;
  [key: string]: any; // allow additional style properties
}

// -----------------------------
// Page & Field Logic and Conditions
// -----------------------------

export interface Logic {
  _id?: string;
  action: 'show' | 'hide';
  eval: 'and' | 'or';
  conditions: Condition[];
  [key: string]: any;
}

export interface Condition {
  _id?: string;
  file: string;
  page: string;
  field: string;

  //Condition Types
  //*= Filled
  //null= Empty
  //= Equals
  //!= Not Equal
  //?= Contains
  //> Greater Than
  //< Less Than
  condition: '*=' | 'null=' | '=' | '!=' | '?=' | '>' | '<';
  value?: any;
  [key: string]: any;
}

interface AppliedFormula {
	_id: string,
	key: 'value',
	formula: string
  [key: string]: any;
}

// -----------------------------
// Field Definitions
// -----------------------------

// Base field interface common to all field types
export interface BaseField {
  type: FieldType;
  _id: string;
  identifier?: string;
  title?: string;
  description?: string;
  required?: boolean;
  tipTitle?: string;
  tipDescription?: string;
  tipVisible?: boolean;
  metadata?: Record<string, any>;
  file: string;
  logic?: Logic;
  hidden?: boolean;
  disabled?: boolean;
  formulas?: AppliedFormula[];
  [key: string]: any;
}


// Using discriminated unions for each field type
export type Field =
  | ImageField
  | FileField
  | BlockField
  | LegacyRichTextField
  | TextField
  | NumberField
  | DateField
  | TextareaField
  | SignatureField
  | MultiSelectField
  | DropdownField
  | TableField
  | ChartField
  | CollectionField
  | CustomField


  export interface CustomField extends BaseField {
    type: string; // Allow any unknown type
    [key: string]: any; // Accept any additional props
  }
  
export interface ImageField extends BaseField {
  type: 'image';
  value?: ImageValue[];
  multi?: boolean;
}

export interface ImageValue {
  _id: string;
  url: string;
  fileName?: string;
  filePath?: string;
}

export interface FileField extends BaseField {
  type: 'file';
  value?: FileValue[];
  multi?: boolean;
}

export interface FileValue {
  _id: string;
  url: string;
  fileName?: string;
  filePath?: string;
}

export interface BlockField extends BaseField {
  type: 'block';
  value?: string;
}

export interface LegacyRichTextField extends BaseField {
  type: 'richText';
  value?: string;
}

export interface TextField extends BaseField {
  type: 'text';
  value?: string; 
}

export interface NumberField extends BaseField {
  type: 'number';
  value?: number | '';
}

export interface DateField extends BaseField {
  type: 'date';
  value?: number | null;
  format?: 'MM/DD/YYYY' | 'MM/DD/YYYY hh:mma' | 'hh:mma';
}

export interface TextareaField extends BaseField {
  type: 'textarea';
  value?: string;
}

export interface SignatureField extends BaseField {
  type: 'signature';
  value?: any;
  signer?: string;
}

export interface MultiSelectField extends BaseField {
  type: 'multiSelect';
  value?: string[];
  options: Option[];
  multi?: boolean;
}

export interface DropdownField extends BaseField {
  type: 'dropdown';
  options: Option[];
  value?: string;
}

export interface TableField extends BaseField {
  type: 'table';
  value: TableRow[];
  rowOrder: string[];
  tableColumns: TableColumn[];
  tableColumnOrder: string[];
}

export interface ChartField extends BaseField {
  type: 'chart';
  value?: ChartSeries[];
  yTitle: string;
  yMax: number;
  yMin: number;
  xTitle: string;
  xMax: number;
  xMin: number;
}

export interface ChartSeries {
  _id: string;
  deleted?: boolean;
  title?: string;
  description?: string;
  points: ChartPoint[];
  [key: string]: any;
}

export interface ChartPoint {
  _id: string;
  label?: string;
  y: number;
  x: number;
  [key: string]: any;
}

export interface CollectionField extends BaseField {
  type: 'collection';
  schema: Schema;
  value: CollectionItem[];
}

// The schema container uses dynamic keys.
export interface Schema {
  [schemaId: string]: SchemaDefinition;
}

// Represents the schema details for each schema key.
export interface SchemaDefinition {
  // Only the root schema has this property.
  root?: boolean;
  title?: string;
  identifier?: string;
  tableColumns: TableColumn[];
  logic?: SchemaLogic;
  children?: string[];
  [key: string]: any;
}

export interface SchemaLogic {
  _id?: string;
  action: 'show' | 'hide';
  eval: 'and' | 'or';
  conditions: SchemaLogicCondition[];
  [key: string]: any;
}

export interface SchemaLogicCondition {
  _id?: string;
  schema: string; //Parent Schema Key
  column: string; //Parent Schema Column._id. Only text, number, dropdown, multiSelect, and barcode column types are supported.

  //Condition Types
  //*= Filled
  //null= Empty
  //= Equals
  //!= Not Equal
  //?= Contains
  //> Greater Than
  //< Less Than
  condition: '*=' | 'null=' | '=' | '!=' | '?=' | '>' | '<';
  value?: any;
  [key: string]: any;
}

// Represents an item in the top-level `value` array.
export interface CollectionItem {
  _id: string;
  // Cells is an object whose keys are column _ids.
  cells?: Record<string, any>;
  // Children is an object where each key is a schema ID and the value
  // is an object with a "value" property that is an array of child items.
  children?: Record<string, { value?: CollectionItem[] }>;
  [key: string]: any;
}

export interface Option {
  _id: string;
  value: string;
  deleted?: boolean;
  width?: number;
  styles?: {
    backgroundColor?: string | null;
  };
  metadata?: Record<string, any>; // @TODO this property is not present in the original file from JF!
  [key: string]: any;
}

export interface TableRow {
  _id: string;
  deleted?: boolean;
  cells?: Record<string, any>;
  [key: string]: any;
}


  type KnownTableColumnType =
  | 'text'
  | 'dropdown'
  | 'image'
  | 'block'
  | 'number'
  | 'date'
  | 'signature'
  | 'multiSelect'
  | 'barcode';

export type TableColumnType = KnownTableColumnType | string;

  

// Base structure for any column
export interface BaseTableColumn {
  _id: string;
  type: TableColumnType;
  title?: string;
  width?: number;
  deleted?: boolean;
  identifier?: string;
  value?: any;
  [key: string]: any;
}

// Extended interfaces by column type
export interface TextColumn extends BaseTableColumn {
  type: "text";
  value?: string;
}

export interface DropdownColumn extends BaseTableColumn {
  type: "dropdown";
  options?: Option[];
  value?: string;
}

export interface MultiSelectColumn extends BaseTableColumn {
  type: "multiSelect";
  options?: Option[];
  value?: string[];
}

export interface ImageColumn extends BaseTableColumn {
  type: "image";
  maxImageWidth?: number;
  maxImageHeight?: number;
}

export interface NumberColumn extends BaseTableColumn {
  type: "number";
  value?: number;
}

export interface DateColumn extends BaseTableColumn {
  type: "date";
  value?: number; // timestamp (e.g. epoch milliseconds)
}

export interface BlockColumn extends BaseTableColumn {
  type: "block";
  value?: string;
}

export interface BarcodeColumn extends BaseTableColumn {
  type: "barcode";
  value?: string;
}

export interface SignatureColumn extends BaseTableColumn {
  type: "signature";
  maxImageWidth?: number;
  maxImageHeight?: number;
}


export interface CustomColumn extends BaseTableColumn {
  type: string; // Unknown type allowed
  [key: string]: any;
}


// Discriminated union for all supported column types
export type TableColumn =
  | TextColumn
  | DropdownColumn
  | MultiSelectColumn
  | ImageColumn
  | NumberColumn
  | DateColumn
  | BlockColumn
  | BarcodeColumn
  | SignatureColumn
  | CustomColumn;
