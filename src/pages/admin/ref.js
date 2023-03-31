<Grid container justifyContent="flex-start" alignItems="flex-start" key={index}>
  <Grid item xs={5}>
    <Stack>
      <Stack
        direction="row"
        spacing={3}
        justifyContent="flex-start"
        alignItems="center"
      >
        <FieldTypeMenu
          handleChangeFieldType={handleChangeFieldType}
          index={index}
          isNextField={false}
        />

        {field.fieldType === "text" ? (
          ""
        ) : (
          <div>
            <input
              type={field.fieldType}
              key={index}
              name={field.fieldType === "radio" ? "radioGroup" : field.name}
            />
          </div>
        )}

        <input
          type="text"
          placeholder=""
          className="option-text"
          value={field.name}
          onChange={(e) => handleFieldNameChange(e.target.value, index)}
        />
      </Stack>
      {field.fieldType !== "text" ? (
        ""
      ) : (
        <Stack>
          <TextField
            fullWidth
            variant="outlined"
            key={index}
            size="small"
            sx={{
              marginTop: 2,
              paddingX: 3,
              marginLeft: 5,
              maxWidth: "70%",
            }}
            placeholder="User Input"
          />
        </Stack>
      )}
      <Stack
        justifyContent="flex-start"
        alignItems="flex-end"
        direction="row"
        spacing={2}
        sx={{ marginLeft: 8 }}
      >
        newFields[index].options[j].options[k].options[n].name =
        <TextField
          size="small"
          variant="standard"
          sx={{
            marginTop: 2,
            maxWidth: "50%",
          }}
          defaultValue={field.helpText}
          inputProps={{ style: { fontSize: 12 } }}
          InputLabelProps={{ style: { fontSize: 12 } }}
          label="Help Text (optional)"
          onBlur={(e) =>
            fieldDataChange(e.target.value, index, false, "helpText")
          }
        />
      </Stack>

      <Stack
        direction="row"
        spacing={3}
        justifyContent="flex-start"
        alignItems="center"
        sx={{ marginTop: 3, marginLeft: 8 }}
      >
        <RequiredCheckBox
          fields={field}
          nextField={false}
          index={index}
          value={field.isRequired}
          fieldDataChange={fieldDataChange}
        />
        {field.fieldType === "text" ? (
          <RegexSelect
            field={field}
            index={index}
            isNextField={false}
            fieldDataChange={fieldDataChange}
          />
        ) : (
          ""
        )}
      </Stack>
    </Stack>
  </Grid>
  <Grid item xs={1}>
    {field.fieldType !== "text" ? (
      <Tooltip title="Add Field Beside" placement="top-start">
        <div>
          <FieldTypeMenu
            handleChangeFieldType={handleChangeFieldType}
            index={index}
            isNextField={true}
          />
        </div>
      </Tooltip>
    ) : (
      ""
    )}
  </Grid>
  <Grid item xs={6}>
    {field.options && Object.keys(field.options).length !== 0 ? (
      <>
        <Stack spacing={2}>
          <TextField
            id="outlined-basic"
            label="Label"
            value={field.options[field.name].name}
            variant="standard"
            sx={{ maxWidth: "250px" }}
            onChange={(e) => {
              const newFields = [...formData.fields];
              newFields[index].options[newFields[index].name].name =
                e.target.value;
              setFormData((prevState) => ({
                ...prevState,
                fields: newFields,
              }));
            }}
          />
          <TextField
            size="small"
            variant="standard"
            defaultValue={field.options[field.name].helpText}
            sx={{
              marginTop: 2,
              maxWidth: "50%",
            }}
            inputProps={{ style: { fontSize: 12 } }}
            InputLabelProps={{ style: { fontSize: 12 } }}
            label="Help Text (optional)"
            onBlur={(e) =>
              fieldDataChange(e.target.value, index, true, "helpText")
            }
          />
          <NextFields
            field={field.options[field.name]}
            index={index}
            nextFieldOptionChange={nextFieldOptionChange}
            addNextFieldOptions={addNextFieldOptions}
            deleteNextFieldOptions={deleteNextFieldOptions}
          />
        </Stack>
        <Grid
          item
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <RequiredCheckBox
            fields={field.options[field.name]}
            nextField={true}
            index={index}
            value={field.options[field.name].isRequired}
            fieldDataChange={fieldDataChange}
          />
          {field.options[field.name].fieldType === "text" ? (
            <RegexSelect
              field={field}
              index={index}
              isNextField={true}
              fieldDataChange={fieldDataChange}
            />
          ) : (
            ""
          )}
        </Grid>
      </>
    ) : (
      ""
    )}
  </Grid>
</Grid>;
