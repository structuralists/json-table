import './App.css'
import JsonTable from '../../src/JsonTable'

const JSON_VALUE = {
   a_string: 'this is a string',
   a_key_ending_in_at_with_a_number_value: 12313123123123,
   a_number_value_with_a_key_ending_in_at: 12313123123123,
   a_key_ending_in_at_with_a_string_value: 'abc',
   a_a_string_value_with_a_key_ending_in_at: 'abc',
   an_empty_object: {},
   an_empty_array: [],
   an_array_of_primative_values: [
      'a_string',
      12323,
      undefined,
      null,
      NaN,
      false,
      true,
      -123,
      '',
      Infinity,
      -Infinity,
      0,
   ],
   an_object: { a: 'a', b: 'b' },
   an_array_of_objects: [
      { a: 'a', b: 'b' },
      { a: 'a', b: 'b' },
   ],
   a_key_ending_in_id: 'a_string',
   another_key_ending_in_id: 123123123,
   a_string_with_new_lines: `hello\ngoodbye\nhello\ngoodbye`,
}

function App() {
   return (
      <div className="App">
         <JsonTable title="JsonTable" json={JSON_VALUE} />
         <JsonTable
            title="JsonTable w/ humanizeKeys"
            humanizeKeys
            json={JSON_VALUE}
         />
      </div>
   )
}

export default App
