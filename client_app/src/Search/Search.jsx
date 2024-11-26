import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import queryString from 'query-string'
import Product from '../API/Product';
import './Search.css'
import { Link } from 'react-router-dom';
import axios from "axios";
Search.propTypes = {

};

function Search(props) {

    const [products, set_products] = useState([])
    const [page, set_page] = useState(1)

    const [show_load, set_show_load] = useState(true)

    useEffect(() => {

        setTimeout(() => {

            const fetchData = async () => {

                const params = {
                    page: page,
                    count: '6',
                    search: sessionStorage.getItem('search')
                }

                const query = '?' + queryString.stringify(params)

                const response = await Product.get_search_list(query)

                if (response.length < 1) {
                    set_show_load(false)
                }

                set_products(prev => [...prev, ...response])

            }

            fetchData()

        }, 2500)

    }, [page])
    const [file, setFile] = useState(null);
    const [predictions, setPredictions] = useState(null);
    const [products1, setProducts1] = useState(null);  // Thay đổi biến từ products thành products1
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select an image');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            setLoading(true);
            setError(null);

            // Gửi yêu cầu đến backend Flask API
            const response = await axios.post('http://localhost:5000/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Nhận kết quả từ API và cập nhật state
            const { predictions, products } = response.data;
            setPredictions(predictions);
            setProducts1(products);  // Sử dụng products1 thay cho products
            setLoading(false);
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('An error occurred while uploading the image');
            setLoading(false);
        }
    };

    return (

        <div className="content-wraper pt-60 pb-60">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                       
                        <div className="shop-products-wrapper">
                            <div className="row">
                                <div className="col">
                                    <InfiniteScroll
                                        style={{ overflow: 'none' }}
                                        dataLength={products.length}
                                        next={() => set_page(page + 1)}
                                        hasMore={true}
                                        loader={show_load ? <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                                            : <h4 className="text-center" style={{ paddingTop: '3rem', color: '#FED700' }}>Yay! You have seen it all</h4>}
                                    >
                                        {
                                            products && products.map(value => (
                                                <div className="row product-layout-list" key={value._id}>
                                                    <div className="col-lg-3 col-md-5 ">
                                                        <div className="product-image">
                                                            <Link to={`/detail/${value._id}`}>
                                                                <img src={value.image} alt="Li's Product Image" />
                                                            </Link>
                                                            <span className="sticker">Mới</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-5 col-md-7">
                                                        <div className="product_desc">
                                                            <div className="product_desc_info">
                                                                <div className="product-review">
                                                                    <h5 className="manufacturer">
                                                                        <a href="product-details.html">{value.name_product}</a>
                                                                    </h5>
                                                                    <div className="rating-box">
                                                                        <ul className="rating">
                                                                            <li><i className="fa fa-star" /></li>
                                                                            <li><i className="fa fa-star" /></li>
                                                                            <li><i className="fa fa-star" /></li>
                                                                            <li><i className="fa fa-star" /></li>
                                                                            <li><i className="fa fa-star" /></li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                                <h4><a className="product_name" href="product-details.html">{value.name_product}</a></h4>
                                                                <div className="price-box">
                                                                    <span className="new-price">${value.price_product}</span>
                                                                </div>
                                                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere assumenda ea quia magnam, aspernatur earum quidem eum et illum dolorem commodi sunt delectus totam blanditiis doloremque at voluptates nisi iusto!</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4">

                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </InfiniteScroll>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Search;