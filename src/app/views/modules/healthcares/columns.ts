import {
  GridDetailColumnType,
  SearchableGridColumnType,
} from '@azlabsjs/ngx-clr-smart-grid';

/** returns the list of datagrid columns to display */
export const gridColumns: SearchableGridColumnType[] = [
  {
    title: 'app.modules.healthcares.columns.id',
    property: 'id',
    field: 'id',
    sortable: false,
    //transform: 'uppercase',
    // TODO: Uncomment codes below to enable search query
    //searcheable: true,
    //search: {
    //flexible: true,
    //}
  },
  {
    title: 'app.modules.healthcares.columns.reference',
    property: 'reference',
    field: 'reference',
    sortable: false,
    //transform: 'uppercase',
    // TODO: Uncomment codes below to enable search query
    //searcheable: true,
    //search: {
    //flexible: true,
    //}
  },
  {
    title: 'app.modules.healthcares.columns.pat_ipn',
    property: 'pat_ipn',
    field: 'pat_ipn',
    sortable: false,
    //transform: 'uppercase',
    // TODO: Uncomment codes below to enable search query
    //searcheable: true,
    //search: {
    //flexible: true,
    //}
  },
  {
    title: 'app.modules.healthcares.columns.pat_firstname',
    property: 'pat_firstname',
    field: 'pat_firstname',
    sortable: false,
    //transform: 'uppercase',
    // TODO: Uncomment codes below to enable search query
    //searcheable: true,
    //search: {
    //flexible: true,
    //}
  },
  {
    title: 'app.modules.healthcares.columns.pat_lastname',
    property: 'pat_lastname',
    field: 'pat_lastname',
    sortable: false,
    //transform: 'uppercase',
    // TODO: Uncomment codes below to enable search query
    //searcheable: true,
    //search: {
    //flexible: true,
    //}
  },
  {
    title: 'app.modules.healthcares.columns.pat_type_id',
    property: 'pat_type_id',
    field: 'pat_type_id',
    sortable: false,
    //transform: 'uppercase',
    // TODO: Uncomment codes below to enable search query
    //searcheable: true,
    //search: {
    //flexible: true,
    //}
  },
  {
    title: 'app.modules.healthcares.columns.pat_birthdate',
    property: 'pat_birthdate',
    field: 'pat_birthdate',
    sortable: false,
    transform: 'date',
    // TODO: Uncomment codes below to enable search query
    //searcheable: true,
    //search: {
    //flexible: true,
    //}
  },
  {
    title: 'app.modules.healthcares.columns.pat_sex',
    property: 'pat_sex',
    field: 'pat_sex',
    sortable: false,
    //transform: 'uppercase',
    // TODO: Uncomment codes below to enable search query
    //searcheable: true,
    //search: {
    //flexible: true,
    //}
  },
  {
    title: 'app.modules.healthcares.columns.pat_right_holder_type_id',
    property: 'pat_right_holder_type_id',
    field: 'pat_right_holder_type_id',
    sortable: false,
    //transform: 'uppercase',
    // TODO: Uncomment codes below to enable search query
    //searcheable: true,
    //search: {
    //flexible: true,
    //}
  },
  {
    title: 'app.modules.healthcares.columns.pat_phone_number',
    property: 'pat_phone_number',
    field: 'pat_phone_number',
    sortable: false,
    //transform: 'uppercase',
    // TODO: Uncomment codes below to enable search query
    //searcheable: true,
    //search: {
    //flexible: true,
    //}
  },
  {
    title: 'app.modules.healthcares.columns.company_encoding',
    property: 'company_encoding',
    field: 'company_encoding',
    sortable: false,
    //transform: 'uppercase',
    // TODO: Uncomment codes below to enable search query
    //searcheable: true,
    //search: {
    //flexible: true,
    //}
  },
  {
    title: 'app.modules.healthcares.columns.company_phone_number',
    property: 'company_phone_number',
    field: 'company_phone_number',
    sortable: false,
    //transform: 'uppercase',
    // TODO: Uncomment codes below to enable search query
    //searcheable: true,
    //search: {
    //flexible: true,
    //}
  },
  {
    title: 'app.modules.healthcares.columns.prescriber_encoding',
    property: 'prescriber_encoding',
    field: 'prescriber_encoding',
    sortable: false,
    //transform: 'uppercase',
    // TODO: Uncomment codes below to enable search query
    //searcheable: true,
    //search: {
    //flexible: true,
    //}
  },
  {
    title: 'app.modules.healthcares.columns.consult_reason_id',
    property: 'consult_reason_id',
    field: 'consult_reason_id',
    sortable: false,
    //transform: 'uppercase',
    // TODO: Uncomment codes below to enable search query
    //searcheable: true,
    //search: {
    //flexible: true,
    //}
  },
  {
    title: 'app.modules.healthcares.columns.at',
    property: 'at',
    field: 'at',
    sortable: false,
    transform: 'date',
    // TODO: Uncomment codes below to enable search query
    //searcheable: true,
    //search: {
    //flexible: true,
    //}
  },
  {
    title: 'app.modules.healthcares.columns.status',
    property: 'status',
    field: 'status',
    sortable: false,
    transform: ['status', 'text', 'uppercase'],
    // style: {
    //   class:
    //     'switch:0->ngx-badge warning;1->ngx-badge success;2->ngx-badge danger;ngx-badge default',
    // },
    // TODO: Uncomment codes below to enable search query
    //searcheable: true,
    //search: {
    //flexible: true,
    //}
  },
  {
    title: 'app.modules.healthcares.columns.created_by',
    property: 'created_by',
    field: 'created_by',
    sortable: false,
    //transform: 'uppercase',
    // TODO: Uncomment codes below to enable search query
    //searcheable: true,
    //search: {
    //flexible: true,
    //}
  },
  {
    title: 'app.modules.healthcares.columns.synchronized',
    property: 'synchronized',
    field: 'synchronized',
    sortable: false,
    //transform: 'uppercase',
    // TODO: Uncomment codes below to enable search query
    //searcheable: true,
    //search: {
    //flexible: true,
    //}
  },
  {
    title: 'app.modules.healthcares.columns.created_at',
    property: 'created_at',
    field: 'created_at',
    sortable: false,
    transform: 'date',
    // TODO: Uncomment codes below to enable search query
    //searcheable: true,
    //search: {
    //flexible: true,
    //}
  },
  {
    title: 'app.modules.healthcares.columns.updated_at',
    property: 'updated_at',
    field: 'updated_at',
    sortable: false,
    transform: 'date',
    // TODO: Uncomment codes below to enable search query
    //searcheable: true,
    //search: {
    //flexible: true,
    //}
  },
];
/** returns the list of detail view columns to display */
export const viewColumns: GridDetailColumnType[] = [
  {
    titleTransform: ['text', 'uppercase'],
    title: 'app.modules.healthcares.columns.id',
    property: 'id',
    // TODO: Uncomment codes below to enable data transformation and search query
    //transform: 'uppercase',
  },
  {
    titleTransform: ['text', 'uppercase'],
    title: 'app.modules.healthcares.columns.reference',
    property: 'reference',
    // TODO: Uncomment codes below to enable data transformation and search query
    //transform: 'uppercase',
  },
  {
    titleTransform: ['text', 'uppercase'],
    title: 'app.modules.healthcares.columns.pat_ipn',
    property: 'pat_ipn',
    // TODO: Uncomment codes below to enable data transformation and search query
    //transform: 'uppercase',
  },
  {
    titleTransform: ['text', 'uppercase'],
    title: 'app.modules.healthcares.columns.pat_firstname',
    property: 'pat_firstname',
    // TODO: Uncomment codes below to enable data transformation and search query
    //transform: 'uppercase',
  },
  {
    titleTransform: ['text', 'uppercase'],
    title: 'app.modules.healthcares.columns.pat_lastname',
    property: 'pat_lastname',
    // TODO: Uncomment codes below to enable data transformation and search query
    //transform: 'uppercase',
  },
  {
    titleTransform: ['text', 'uppercase'],
    title: 'app.modules.healthcares.columns.pat_type_id',
    property: 'pat_type_id',
    // TODO: Uncomment codes below to enable data transformation and search query
    //transform: 'uppercase',
  },
  {
    titleTransform: ['text', 'uppercase'],
    title: 'app.modules.healthcares.columns.pat_birthdate',
    property: 'pat_birthdate',
    // TODO: Uncomment codes below to enable data transformation and search query
    transform: 'date',
  },
  {
    titleTransform: ['text', 'uppercase'],
    title: 'app.modules.healthcares.columns.pat_sex',
    property: 'pat_sex',
    // TODO: Uncomment codes below to enable data transformation and search query
    //transform: 'uppercase',
  },
  {
    titleTransform: ['text', 'uppercase'],
    title: 'app.modules.healthcares.columns.pat_right_holder_type_id',
    property: 'pat_right_holder_type_id',
    // TODO: Uncomment codes below to enable data transformation and search query
    //transform: 'uppercase',
  },
  {
    titleTransform: ['text', 'uppercase'],
    title: 'app.modules.healthcares.columns.pat_phone_number',
    property: 'pat_phone_number',
    // TODO: Uncomment codes below to enable data transformation and search query
    //transform: 'uppercase',
  },
  {
    titleTransform: ['text', 'uppercase'],
    title: 'app.modules.healthcares.columns.company_encoding',
    property: 'company_encoding',
    // TODO: Uncomment codes below to enable data transformation and search query
    //transform: 'uppercase',
  },
  {
    titleTransform: ['text', 'uppercase'],
    title: 'app.modules.healthcares.columns.company_phone_number',
    property: 'company_phone_number',
    // TODO: Uncomment codes below to enable data transformation and search query
    //transform: 'uppercase',
  },
  {
    titleTransform: ['text', 'uppercase'],
    title: 'app.modules.healthcares.columns.prescriber_encoding',
    property: 'prescriber_encoding',
    // TODO: Uncomment codes below to enable data transformation and search query
    //transform: 'uppercase',
  },
  {
    titleTransform: ['text', 'uppercase'],
    title: 'app.modules.healthcares.columns.consult_reason_id',
    property: 'consult_reason_id',
    // TODO: Uncomment codes below to enable data transformation and search query
    //transform: 'uppercase',
  },
  {
    titleTransform: ['text', 'uppercase'],
    title: 'app.modules.healthcares.columns.at',
    property: 'at',
    // TODO: Uncomment codes below to enable data transformation and search query
    transform: 'date',
  },
  {
    titleTransform: ['text', 'uppercase'],
    title: 'app.modules.healthcares.columns.status',
    property: 'status',
    transform: ['status', 'text', 'uppercase'],
    style: {
      cssClass:
        'switch:0->ngx-badge warning;1->ngx-badge success;2->ngx-badge danger;ngx-badge default',
    },
  },
  {
    titleTransform: ['text', 'uppercase'],
    title: 'app.modules.healthcares.columns.created_by',
    property: 'created_by',
    // TODO: Uncomment codes below to enable data transformation and search query
    //transform: 'uppercase',
  },
  {
    titleTransform: ['text', 'uppercase'],
    title: 'app.modules.healthcares.columns.synchronized',
    property: 'synchronized',
    // TODO: Uncomment codes below to enable data transformation and search query
    //transform: 'uppercase',
  },
  {
    titleTransform: ['text', 'uppercase'],
    title: 'app.modules.healthcares.columns.created_at',
    property: 'created_at',
    // TODO: Uncomment codes below to enable data transformation and search query
    transform: 'date',
  },
  {
    titleTransform: ['text', 'uppercase'],
    title: 'app.modules.healthcares.columns.updated_at',
    property: 'updated_at',
    // TODO: Uncomment codes below to enable data transformation and search query
    transform: 'date',
  },
];
