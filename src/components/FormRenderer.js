import React from "react";
import {
    Form,
    Input,
    Card,
    Button,
    Radio,
    Checkbox
} from 'antd';
  
  class FormRenderer extends React.Component {
    state = {
      confirmDirty: false,
      value: ""
    };
  
    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    };

    onRadioChange = e => {
      console.log('radio checked', e.target.value);
      this.setState({
        value: e.target.value,
      });
    };

    onCheckboxChange = checkedValues => {
      console.log('checked = ', checkedValues);
    };
  
    handleConfirmBlur = e => {
      const { value } = e.target;
      this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
  
    render() {
      const form = this.props.formJSON;
      const { getFieldDecorator } = this.props.form;
      const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      };
      const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      };
      let formComponents = [];
      form.fields.forEach((field) => {
        let component = null;
          switch (String(field.type)) {
              case "textfield":
                component = <Form.Item label={field.label}>
                    {getFieldDecorator(field.label, {
                      rules: [
                        {
                          type: field.isEmail === true ? 'email' : null,
                          message: field.isEmail === true ? 'The input is not valid E-mail!' : '',
                        },
                        {
                          required: field.isRequired,
                          message: field.isRequired === true ? 'This field is required.' : ''
                        },
                      ],
                    })(<Input placeholder={field.label} />)}
                  </Form.Item>
                  break;
              case "textarea":
                component=<Form.Item label={field.label}>
                    {getFieldDecorator(field.label, {
                        rules: [
                            {
                            required: field.isRequired,
                            message: field.isRequired === true ? 'This field is required.' : ''
                            },
                        ],
                    })(<Input.TextArea placeholder={field.label}  />)}
                  </Form.Item>
                  break;
              case "radio":
                  component = <Form.Item label={field.label}>
                  {getFieldDecorator(field.label, {
                      rules: [
                          {
                          required: field.isRequired,
                          message: field.isRequired === true ? 'This field is required.' : ''
                          },
                      ],
                  })(<Radio.Group onChange={this.onRadioChange} value={this.state.value}>
                    {field.options.map((option, key) => {
                      return  <Radio style={radioStyle} key={key} value={option}>{option}</Radio>
                    })}
                  </Radio.Group>)}
                </Form.Item>
                  break;
              case "checkbox":
                  component = <Form.Item label={field.label}>
                  {getFieldDecorator(field.label, {
                      rules: [
                          {
                          required: field.isRequired,
                          message: field.isRequired === true ? 'This field is required.' : ''
                          },
                      ],
                  })(<Checkbox.Group style={{ width: '100%' }} onChange={this.onCheckboxChange}>
                  {field.options.map((option, key) => {
                    return  <Checkbox key={key} value={option} style={radioStyle}>{option}</Checkbox>
                  })} 
                </Checkbox.Group>)}
                </Form.Item>
                  break;
          }
          formComponents.push(component);
      });
      return (
        <Card 
          style={{type:"flex", justify:"center", align:"middle", padding:10}}
        >
          <div className="header-section">
            <h2 className="heading-text">{form.formTitle}</h2>
            <p className="heading-paragraph">{form.formDescription}</p>
          </div>
          <Form  onSubmit={this.handleSubmit} layout="vertical">
            <div>{formComponents}</div>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      );
    }
  }
  
 export default Form.create({ name: 'DynamicForm' })(FormRenderer);