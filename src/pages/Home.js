import React from "react";
import { 
  Icon, 
  Card, 
  Switch, 
  Button, 
  Form, 
  Radio,
  Checkbox,
  Input,
  Row,
  Col,
  Select,
  Modal } from "antd";
import { StickyContainer, Sticky } from 'react-sticky';
import DisplayJSON from '../components/DisplayJSON';
import FormRenderer from '../components/FormRenderer';
import "antd/dist/antd.css";
import "../index.css";

const { Option } = Select;
let id = 0;
let uuid1 = 0;

class FormBuilder extends React.Component {

  state = {
    formTitle: "",
    formDescription: "",
    inputTypes: [],
    requiredFields: [],
    emailFields: [],
    visible: false,
    renderForm: false,
    formJSON: {},
  }

  constructor(props) {
    super(props);
    this.handleFormTitleChange = this.handleFormTitleChange.bind(this);
    this.handleformDescriptionChange = this.handleFormDescriptionChange.bind(this);
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      renderForm: true,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
      renderForm: false,
    });
  };

  handleFormTitleChange(value) {
    this.setState({formTitle: value})
  }

  handleFormDescriptionChange(value) {
    this.setState({formDescription: value})
  }

  handleFieldTypeChange(i,value) {
    let inputTypes = [...this.state.inputTypes];
    inputTypes[i] = value;
    this.setState({ inputTypes });
  }

  setIsRequired(i,value) {
    let requiredFields = [...this.state.requiredFields];
    requiredFields[i] = value;
    this.setState({ requiredFields });
  }

  setIsEmail(i,value) {
    let emailFields = [...this.state.emailFields];
    emailFields[i] = value;
    this.setState({ emailFields });
  }

  removeOption = (k1, l) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("optionkeys" + k1);
    // We need at least one option
    if (keys.length === 1) {
      //return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      ["optionkeys" + k1]: keys.filter(key => key !== l)
    });
  };

  addOption = index => {
    console.log(index);
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("optionkeys" + index);
    const nextKeys = keys.concat(uuid1);
    uuid1++;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      ["optionkeys" + index]: nextKeys
    });
  };


  removeQuestion = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("keys");
    // We need at least one passenger
    if (keys.length === 1) {
      //return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };

  addQuestion = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("keys");
    const nextKeys = keys.concat(id);
    id++;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys
    });
  };

  structureFormJSON(values) {
    const { questions, options } = values;
    const { formTitle, formDescription, emailFields, requiredFields, inputTypes } = this.state;
    let formStructure = {
      "formTitle": formTitle,
      "formDescription": formDescription,
      "fields": []
    };
    questions.forEach((question, i) => {
      let fieldProperty = {};
      fieldProperty.label = question;
      fieldProperty.type = inputTypes[i] === undefined ? 'textfield' : inputTypes[i];
      fieldProperty.isRequired = requiredFields[i] === undefined ? false : requiredFields[i];
      fieldProperty.isEmail = emailFields[i] === undefined ? false : emailFields[i];
      if(inputTypes[i] === "checkbox" || inputTypes[i] === "radio") {
        fieldProperty.options = options[i].filter((el) => {
          return el != null;
        });
      }
      formStructure.fields.push(fieldProperty);
    });
    this.setState({
      formJSON: formStructure
    }, () => this.showModal());
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.structureFormJSON(values);
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {xs: 8, sm: 16, md: 24, lg: 32},
      wrapperCol: {xs: 8, sm: 16, md: 24, lg: 32}
    };
    const tailFormItemLayout = {
      wrapperCol: {xs: 8, sm: 16, md: 24, lg: 32},
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };

    let questionKeys = [];
    let optionKeys = [];
    getFieldDecorator('keys', { initialValue: [] });
    questionKeys = getFieldValue('keys');
    const formItems = questionKeys.map((k, index) => {
      getFieldDecorator(`optionkeys${k}`, { initialValue: [] });
      optionKeys = getFieldValue(`optionkeys${k}`);
      if (
        optionKeys === undefined || optionKeys.length === 0
      ) {
        optionKeys = [];
      }
      return (
        <div key={k}>
          <Row gutter={16}>
            <Col className="gutter-row" span={20}>
              <Card
                  {...tailFormItemLayout}
                  style={{ 
                      marginTop: 16,  
                      width:600, 
                      marginLeft: 260,
                      marginBottom: 16,
                      selfAlign:"center" 
                  }}
                  type="inner"
                  actions={[
                    <p>
                      Required <Switch onChange={v => this.setIsRequired(k, v)} />
                    </p>,
                    <p>
                      Email <Switch onChange={v => this.setIsEmail(k, v)} />
                    </p>,
                    <Button 
                      className="no-border" 
                      onClick={() => this.removeQuestion(k)}
                    >
                      Remove <Icon
                      className="dynamic-delete-button"
                      type="minus-circle-o"
                      />
                    </Button>
                  ]}
                >
                  <Form.Item
                      {...formItemLayoutWithOutLabel}
                      required={false}
                      key={k}
                  >
                      {getFieldDecorator(`questions[${k}]`, {
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [
                          {
                              required: true,
                              whitespace: true,
                              message: "Please input your question or delete this field.",
                          },
                      ],
                      })(<Input placeholder="Question" style={{ width: '60%', marginRight: 8 }} />)}    
                  </Form.Item>
                  {
                    this.state.inputTypes[k] === "textfield" || this.state.inputTypes.length < 1 ? (
                      <p>Short answer text</p>             
                    ): null
                  }
                  {
                    this.state.inputTypes[k] === "textarea" ? (
                      <p>Long answer text</p>             
                    ): null
                  }
                  {
                    this.state.inputTypes[k] === "radio" || this.state.inputTypes[k] === "checkbox" ? (
                      <ul className="option-list">
                        {optionKeys.map((j, index1) => {
                          const optionAccepter =  <Form.Item
                          {...formItemLayoutWithOutLabel}
                          required={false}
                          key={j}
                        >
                          {getFieldDecorator(`options[${k}][${j}]`, {
                          initialValue: `Option ${index1 +1}`,
                          validateTrigger: ['onChange', 'onBlur'],
                          rules: [
                              {
                                  required: true,
                                  message: "Please input your option or delete this field.",
                              },
                          ],
                          })(<Input />)}    
                        </Form.Item>
                          return (
                          <li className={this.state.inputTypes[k] === "radio" ? "radio-field" : "checkbox-field"} key={j}>
                            {this.state.inputTypes[k] === "radio" ? (
                              <Radio disabled={true}>
                                {optionAccepter}
                              </Radio>
                              ) : ( <Checkbox disabled={true}>
                                {optionAccepter}
                              </Checkbox>)
                            }
                            <span onClick={() => this.removeOption(k, j)} className="remove-option"> X </span>
                          </li>
                          );
                        })}
                        <div className="add-option" onClick={() => this.addOption(k)}>
                          <span> + Add Option</span>
                        </div>
                      </ul>
                    ): null
                  }
              </Card>
            </Col>
            <Col  className="gutter-row" span={4}>
              <Form.Item
                  {...formItemLayoutWithOutLabel}
                  required={false}
                  key={k}
              >
                {getFieldDecorator(`inputFieldType[${k}]`, {
                validateTrigger: ['onChange', 'onBlur'],
                initialValue: "textfield",
                })(
                  <Select
                    onChange={v => this.handleFieldTypeChange(k, v)}
                  >
                    <Option selected value="textfield">Short Answer</Option>
                    <Option value="textarea">Paragraph</Option>
                    <Option value="checkbox">CheckBox</Option>
                    <Option value="radio">Radio</Option>
                  </Select>
                )}    
              </Form.Item>
            </Col>
          </Row>
        </div>
      )
    });

    return (
      <StickyContainer>
        <Modal
            title="Form Structure JSON"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            centered
            footer={[
              <Button key="back" onClick={this.handleCancel}>
                Close
              </Button>,
              <Button key="submit" type="primary" disabled={this.state.renderForm} onClick={this.handleOk}>
                Render Form
              </Button>,
            ]}
          >
            {
              this.state.renderForm === true ? <FormRenderer formJSON={this.state.formJSON} /> : <DisplayJSON data={this.state.formJSON} />
            }
        </Modal>
        <div className="header-section">
          <h2 className="heading-text">Simple Form Builder</h2>
        </div>
        <Form {...formItemLayoutWithOutLabel} onSubmit={this.handleSubmit}>
          <Card style={{type:"flex", justify:"center", align:"middle", margin:20, paddingLeft: 34, paddingRight: 34 }}>
            <Row gutter={16}>
              <Col className="gutter-row" span={20}>
                <Form.Item label="">
                    <Input  
                      placeholder={"Form Title"}
                      value={this.state.formTitle}
                      onChange={e => this.handleFormTitleChange(e.target.value)}
                    />
                </Form.Item>
                <Form.Item label="">
                    <Input.TextArea 
                      placeholder={"Form Description"}
                      value={this.state.formDescription}
                      onChange={e => this.handleFormDescriptionChange(e.target.value)}
                    />
                </Form.Item>
                {formItems}
              </Col>
              <Col className="gutter-row" span={4}>
                  <Sticky topOffset={80}>
                    {({
                      style
                    }) => (
                      <Button type="dashed" className="sidebar-btn" style={style} onClick={this.addQuestion}>
                        <Icon type="plus" /> Add Question
                      </Button>
                    )}
                  </Sticky>
              </Col>
            </Row>
          </Card>
          <Form.Item 
            {...formItemLayout}
          >
            <Button
              type="primary"
              htmlType="submit"
            >
              Publish
            </Button>
          </Form.Item>
      </Form>
    </StickyContainer>
    );
  }
}

const SurveryFormBuilder = Form.create()(FormBuilder);
export default SurveryFormBuilder;
