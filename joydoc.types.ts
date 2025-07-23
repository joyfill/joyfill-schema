//Version: 1.0.1 (July 11th 2025)

// Top-level Template interface
export interface Template {
  _id: string;
  type: 'template' | 'document';
  stage?: string;
  metadata?: Record<string, any>;
  identifier?: string;
  name: string;
  createdOn: number;
  files: TemplateFile[];
  fields: Field[];
  deleted: boolean;
  categories?: string[];
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
  views: View[];
}

export interface View {
  type?: 'mobile';
  pageOrder: string[];
  pages: Page[];
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
      tableColumns?: {
        [columnId: string]: {
          format?: string;
          hidden?: boolean;
        };
      }
    }
  }
  tableColumns?: {
    [columnId: string]: {
      format?: string;
      hidden?: boolean;
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


export type FieldType =
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
  | CollectionField;

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
  value?: ChartSeries[]; //@TODO: the original file from JF required this property!
  yTitle: string;
  yMax: number;
  yMin: number;
  xTitle: string;
  xMax: number;
  xMin: number;
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
}

export interface SchemaLogic {
  _id?: string;
  action: 'show' | 'hide';
  eval: 'and' | 'or';
  conditions: SchemaLogicCondition[];
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
}

// Represents an item in the top-level `value` array.
export interface CollectionItem {
  _id: string;
  // Cells is an object whose keys are column _ids.
  cells?: Record<string, any>;
  // Children is an object where each key is a schema ID and the value
  // is an object with a "value" property that is an array of child items.
  children?: Record<string, { value?: CollectionItem[] }>;
}

// Represents a child item inside a nested collection.
export interface CollectionItemChild {
  _id: string;
  cells?: Record<string, any>;
  children?: Record<string, { value: CollectionItemChild[] }>;
}

export interface Option {
  _id: string;
  value: string;
  deleted?: boolean;
  width?: number;
  styles?: {
    backgroundColor?: string | null
  };
  metadata?: Record<string, any>; // @TODO this property is not present in the original file from JF!
}

export interface TableRow {
  _id: string;
  deleted?: boolean;
  cells?: Record<string, any>;
}

export type TableColumnType =
  | 'text'
  | 'dropdown'
  | 'image'
  | 'block'
  | 'number'
  | 'date'
  | 'signature'
  | 'multiSelect'
  | 'barcode';

// Base structure for any column
export interface BaseTableColumn {
  _id: string;
  type: TableColumnType;
  title?: string;
  width?: number;
  deleted?: boolean;
  identifier?: string;
  value?: any;
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
  | SignatureColumn;

export interface ChartSeries {
  _id: string;
  deleted?: boolean;
  title?: string;
  description?: string;
  points: ChartPoint[];
}

export interface ChartPoint {
  _id: string;
  label?: string;
  y: number;
  x: number;
}