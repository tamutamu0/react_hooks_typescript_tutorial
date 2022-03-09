type Todo = {
  value: string;
  readonly id: number;
  checked:boolean;
  removed:boolean;
};
type Filter = 'all' | 'checked' | 'unchecked' | 'removed';

// React から useState フックをインポート
import { useState } from 'react';

export const App = () => {
  /**
   * text = ステートの値
   * setText = ステートの値を更新するメソッド
   * useState の引数 = ステートの初期値 (=空の文字列)
   */
  const [text, setText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter,setFilter] = useState<Filter>('all');
  const handleOnSubmit = () => {
    if (!text) return;

    //新しいTodoを作成
    const newTodos: Todo = {
      value: text,
      id: new Date().getTime(),
      checked:false,
      removed:false,
    }
    //スプレット構文を用いてtodoステートのコピーへnewTodoを追加する
    setTodos([newTodos, ...todos]);
    setText('');
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }

  const handleOnEdit = (id:number,value:string) => {
    const deepCopy = todos.map((todo)=> ({...todo}));
    const newTodos = deepCopy.map((todo)=>{
      if ((todo.id)===id){
        todo.value=value;
      }
      return todo;
    });
    console.log('=== Original todos ===');
    todos.map((todo) => console.log(`id: ${todo.id}, value: ${todo.value}`));
    setTodos(newTodos);
  }

  const handleOnCheck = (id:number,checked:boolean) => {
    const deepCopy = todos.map((todo) => ({...todo}));
    const newTodos = deepCopy.map((todo)=>{
      if (todo.id === id ) {
        todo.checked = !checked;
      }
      return todo;
    });
    setTodos(newTodos);
  }

  const handleOnRemove=(id:number,removed:boolean)=>{
    const deepCopy = todos.map((todo)=>({...todo}));
    const newTodos = deepCopy.map((todo)=>{
      if (todo.id === id){
        todo.removed = !removed;
      }
      return todo;
    });
    setTodos(newTodos);
  }

  const filterdTodos = todos.filter((todo)=>{
    switch (filter) {
      case 'all':
        return !todo.removed;
      case 'checked':
        return todo.checked;
      case 'removed':
        return todo.removed;
      case 'unchecked':
        return !todo.checked;
      default:todo;
    }
  })

  return (
    <div>
      <select defaultValue="all" onChange={(e)=> setFilter(e.target.value as Filter)}>
        <option value="all">全てのタスク</option>
        <option value="checked">完了したタスク</option>  
        <option value="unchecked">現在のタスク</option>
        <option value="removed">ごみ箱</option>
      </select>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleOnSubmit();
        }}
      >
        {/*
          入力中テキストの値を text ステートが
          持っているのでそれを value として表示

          onChange イベント（＝入力テキストの変化）を
          text ステートに反映する
         */}
        <input
          type="text"
          value={text}
          onChange={(e) => handleOnChange(e)}
        />
        <input
          type="submit"
          value="追加"
          onSubmit={(e) => e.preventDefault()}
        />
      </form>
      <ul>
        {filterdTodos.map((todo) => {
          return (
            <li key={todo.id}>
              <input 
                type='checkbox'
                disabled={todo.removed}
                checked={todo.checked}
                onChange={()=>handleOnCheck(todo.id,todo.checked)}
              />
              <input
                type='text'
                disabled={todo.checked || todo.removed}
                value={todo.value}
                onChange={(e)=>handleOnEdit(todo.id,e.target.value)}
              />
              <button onClick={()=>handleOnRemove(todo.id,todo.removed)}>
                {todo.removed?'復元':'削除'}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
