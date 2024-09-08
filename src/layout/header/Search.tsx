/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { Search as LucideSearch, X } from 'lucide-react';
import { colors } from '@/styles/colors';
import useSearchStore from '@/stores/useSearchStore';

const MAX_RECENT_SEARCHES = 5;

function Search() {
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecent, setShowRecent] = useState(false);
  const [isAutoSave, setIsAutoSave] = useState(true); // 자동저장 설정 상태 추가
  const navigate = useNavigate();
  const setSearchTerm = useSearchStore((state) => state.setSearchTerm);
  const recentSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedSearches = localStorage.getItem('recentSearches');
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }

    // 외부 클릭 감지해서 창 닫기
    const handleClickOutside = (e: MouseEvent) => {
      if (
        recentSearchRef.current &&
        !recentSearchRef.current.contains(e.target as Node) &&
        isFocus
      ) {
        setShowRecent(false);
        setIsFocus(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFocus]);

  const handleFocus = () => {
    setIsFocus(true);
    if (recentSearches.length > 0) {
      setShowRecent(true); // 최근 검색어 창을 항상 열도록
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const addRecentSearch = (term: string) => {
    if (isAutoSave) {
      const updatedSearches = [term, ...recentSearches.filter((s) => s !== term)].slice(
        0,
        MAX_RECENT_SEARCHES,
      );
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      setSearchTerm(value);
      addRecentSearch(value);
      setShowRecent(false); // 검색 후 최근 검색어 창 닫기
      // 검색 후에도 검색창 클릭 시 다시 최근 검색어 창이 열리도록 setIsFocus(false)를 제거
      navigate('/search-results');
    }
  };

  const handleRecentSearch = (term: string) => {
    setValue(term);
    setSearchTerm(term);
    addRecentSearch(term);
    setShowRecent(false); // 검색어 선택 시 창 닫기
    navigate('/search-results');
  };

  const removeRecentSearch = (term: string) => {
    const updatedSearches = recentSearches.filter((s) => s !== term);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // 자동저장 기능 토글
  const toggleAutoSave = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAutoSave(e.target.checked);
  };

  return (
    <div css={searchContainer} ref={recentSearchRef}>
      <form css={search(isFocus)} onSubmit={handleSubmit}>
        <div className="inner">
          <input
            title="검색어"
            value={value}
            onFocus={handleFocus} // 검색 후 클릭해도 최근 검색어 창이 뜨도록 handleFocus 유지
            onChange={handleChange}
            placeholder="검색어를 입력하세요"
          />
          <button type="submit">
            <LucideSearch size="18" />
          </button>
        </div>
      </form>
      {showRecent && recentSearches.length > 0 && (
        <div css={recentSearchesStyle}>
          <h4>최근 검색어</h4>
          <ul>
            {recentSearches.map((term, index) => (
              <li key={index}>
                <span onClick={() => handleRecentSearch(term)}>{term}</span>
                <button onClick={() => removeRecentSearch(term)}>
                  <X size={12} />
                </button>
              </li>
            ))}
          </ul>
          <div css={autoSaveToggle}>
            <label>
              <input type="checkbox" checked={isAutoSave} onChange={toggleAutoSave} />
              자동저장 {isAutoSave ? '켜짐' : '꺼짐'}
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

const searchContainer = css`
  position: relative;
  width: calc(100% - 660px);
  left: 50%;
  max-width: 600px;
  min-width: 361px;
  position: absolute;
  top: 13px;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  z-index: 11100;
  @media (min-width: 1200px) {
    width: calc(100% - 930px);
  }
`;

const search = (isFocus: boolean) => css`
  .inner {
    display: flex;
    height: 38px;
    padding: 0 12px 0 14px;
    border: 1px solid ${isFocus ? `#1EE13C` : `#4a4a4a`};
    border-radius: 20px;
    align-items: center;
  }

  input {
    color: ${colors.white};
    flex: 1 1;
    font-size: 15px;
    height: 100%;
    min-width: 0;
    outline: none;
    background-color: transparent;

    &::placeholder {
      color: ${colors.placeHolderGray};
    }
  }

  button {
    color: ${colors.veryLightGray};
    background-color: transparent;
    border: none;
    cursor: pointer;
  }
`;

const recentSearchesStyle = css`
  margin-top: 5px;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${colors.lightblack};
  border: 1px solid ${colors.borderGray};
  border-top: none;
  border-radius: 20px;
  padding: 22px 22px 12px;
  z-index: 1000;

  h4 {
    color: ${colors.white};
    margin-bottom: 10px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 8px;
    color: ${colors.lightestGray};
    cursor: pointer;

    &:hover {
      background-color: ${colors.darkestGray};
      border-radius: 5px;
    }

    span {
      flex-grow: 1;
    }

    button {
      background: none;
      border: none;
      color: ${colors.lightestGray};
      cursor: pointer;
      padding: 2px;

      &:hover {
        color: ${colors.white};
      }
    }
  }
`;

const autoSaveToggle = css`
  margin-top: 10px;
  font-size: 14px;
  color: ${colors.lightestGray};
  display: flex;
  justify-content: flex-end;

  label {
    cursor: pointer;
    display: flex;
    align-items: center;

    input {
      margin-right: 8px;
    }
  }
`;

export default Search;
